import type { SigilCode } from '../types';

type AxisScores = {
    V: number; S: number;
    I: number; C: number;
    E: number; L: number;
    Q: number; D: number;
};

/**
 * 拡張診断用の回答型（5択対応）
 */
export interface ExtendedAnswer {
    questionId: number;
    axis: 'V' | 'S' | 'I' | 'C' | 'E' | 'L' | 'Q' | 'D';
    score: number; // -2, -1, 0, 1, 2
}

/**
 * 既存の2択診断システム（互換性維持）
 */
export function calculateSigilType(answers: Array<{ questionId: number, selectedAxis: string }>): SigilCode {
    const scores: AxisScores = {
        V: 0, S: 0,
        I: 0, C: 0,
        E: 0, L: 0,
        Q: 0, D: 0
    };

    answers.forEach(ans => {
        if (scores[ans.selectedAxis as keyof AxisScores] !== undefined) {
            scores[ans.selectedAxis as keyof AxisScores] += 1;
        }
    });

    return (
        (scores.V >= scores.S ? 'V' : 'S') +
        (scores.I >= scores.C ? 'I' : 'C') +
        (scores.E >= scores.L ? 'E' : 'L') +
        (scores.Q >= scores.D ? 'Q' : 'D')
    );
}

/**
 * 拡張診断システム（5択・40問対応）
 * 
 * スコアリング:
 * - 各軸で -20〜+20の範囲
 * - 閾値: -4〜+4は中立（タイブレーク）、それ以外は優位側
 */
export function calculateExtendedSigilType(answers: ExtendedAnswer[]): SigilCode {
    // 各軸のスコアを集計
    const axisScores = {
        VS: 0, // V側が正、S側が負
        IC: 0, // I側が正、C側が負
        EL: 0, // E側が正、L側が負
        QD: 0  // Q側が正、D側が負
    };

    answers.forEach(ans => {
        switch (ans.axis) {
            case 'V':
                axisScores.VS += ans.score;
                break;
            case 'S':
                axisScores.VS -= ans.score; // S側は負の方向
                break;
            case 'I':
                axisScores.IC += ans.score;
                break;
            case 'C':
                axisScores.IC -= ans.score;
                break;
            case 'E':
                axisScores.EL += ans.score;
                break;
            case 'L':
                axisScores.EL -= ans.score;
                break;
            case 'Q':
                axisScores.QD += ans.score;
                break;
            case 'D':
                axisScores.QD -= ans.score;
                break;
        }
    });

    // 閾値判定（中立域: -4〜+4）
    const axis1 = axisScores.VS > 4 ? 'V' : axisScores.VS < -4 ? 'S' : axisScores.VS >= 0 ? 'V' : 'S';
    const axis2 = axisScores.IC > 4 ? 'I' : axisScores.IC < -4 ? 'C' : axisScores.IC >= 0 ? 'I' : 'C';
    const axis3 = axisScores.EL > 4 ? 'E' : axisScores.EL < -4 ? 'L' : axisScores.EL >= 0 ? 'E' : 'L';
    const axis4 = axisScores.QD > 4 ? 'Q' : axisScores.QD < -4 ? 'D' : axisScores.QD >= 0 ? 'Q' : 'D';

    return `${axis1}${axis2}${axis3}${axis4}` as SigilCode;
}

/**
 * 各軸のスコア情報を取得（可視化用）
 */
export interface AxisScoreDetail {
    axis: string;
    score: number;
    percentage: number; // -100〜+100
    label: string;
}

export function getAxisScoreDetails(answers: ExtendedAnswer[]): AxisScoreDetail[] {
    const axisScores = {
        VS: 0,
        IC: 0,
        EL: 0,
        QD: 0
    };

    answers.forEach(ans => {
        switch (ans.axis) {
            case 'V':
                axisScores.VS += ans.score;
                break;
            case 'S':
                axisScores.VS -= ans.score;
                break;
            case 'I':
                axisScores.IC += ans.score;
                break;
            case 'C':
                axisScores.IC -= ans.score;
                break;
            case 'E':
                axisScores.EL += ans.score;
                break;
            case 'L':
                axisScores.EL -= ans.score;
                break;
            case 'Q':
                axisScores.QD += ans.score;
                break;
            case 'D':
                axisScores.QD -= ans.score;
                break;
        }
    });

    return [
        {
            axis: 'V/S',
            score: axisScores.VS,
            percentage: (axisScores.VS / 20) * 100,
            label: axisScores.VS > 0 ? 'V寄り' : axisScores.VS < 0 ? 'S寄り' : '中立'
        },
        {
            axis: 'I/C',
            score: axisScores.IC,
            percentage: (axisScores.IC / 20) * 100,
            label: axisScores.IC > 0 ? 'I寄り' : axisScores.IC < 0 ? 'C寄り' : '中立'
        },
        {
            axis: 'E/L',
            score: axisScores.EL,
            percentage: (axisScores.EL / 20) * 100,
            label: axisScores.EL > 0 ? 'E寄り' : axisScores.EL < 0 ? 'L寄り' : '中立'
        },
        {
            axis: 'Q/D',
            score: axisScores.QD,
            percentage: (axisScores.QD / 20) * 100,
            label: axisScores.QD > 0 ? 'Q寄り' : axisScores.QD < 0 ? 'D寄り' : '中立'
        }
    ];
}

export function getSigilDescription(_code: SigilCode): string {
    return "Sigil Description Placeholder";
}
