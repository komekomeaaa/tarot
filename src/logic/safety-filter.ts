import type { Category, UserContext } from '../types';

/**
 * 安全フィルターの結果
 */
export interface FilterResult {
    filtered: string;
    warnings: Warning[];
}

/**
 * 警告情報
 */
export interface Warning {
    severity: 'info' | 'warning' | 'critical';
    type: string;
    message: string;
}

/**
 * 安全フィルター適用後の出力
 */
export interface SafeOutput {
    output: string;
    blocked: boolean;
    warnings: Warning[];
}

/**
 * 安全フィルターの定義
 */
interface SafetyFilter {
    name: string;
    category: Category[];
    check: (output: string, context: UserContext) => FilterResult;
}

/**
 * 健康カテゴリフィルター
 * 診断的表現を除去し、医療機関への導線を提供
 */
const HEALTH_FILTER: SafetyFilter = {
    name: 'health',
    category: ['health'],
    check: (output, context) => {
        const forbiddenPatterns = [
            { pattern: /診断/g, replacement: '状況' },
            { pattern: /病気/g, replacement: '体調' },
            { pattern: /治療/g, replacement: 'ケア' },
            { pattern: /薬/g, replacement: 'サポート' },
            { pattern: /医者に行かなくて/g, replacement: '' }
        ];

        let filtered = output;
        const warnings: Warning[] = [];

        for (const { pattern, replacement } of forbiddenPatterns) {
            if (pattern.test(filtered)) {
                warnings.push({
                    severity: 'critical',
                    type: 'health_diagnosis',
                    message: '診断的表現を検出'
                });
                filtered = filtered.replace(pattern, replacement);
            }
        }

        // 困り度が高い場合は医療機関への導線を追加
        if (warnings.length > 0 || (context.urgency !== undefined && context.urgency >= 4)) {
            filtered += '\n\n※体調に不安がある場合は、医療機関にご相談ください。';
        }

        return { filtered, warnings };
    }
};

/**
 * 金銭カテゴリフィルター
 * 断定的投資助言を除去
 */
const FINANCIAL_FILTER: SafetyFilter = {
    name: 'financial',
    category: ['money'],
    check: (output, _context) => {
        const forbiddenPatterns = [
            { pattern: /必ず(儲かる|うまくいく|成功する)/g, replacement: '可能性があります' },
            { pattern: /絶対に/g, replacement: '十分に' },
            { pattern: /確実に(増える|利益|儲)/g, replacement: '期待できる' },
            { pattern: /投資すべき/g, replacement: '投資を検討するのも選択肢' }
        ];

        let filtered = output;
        const warnings: Warning[] = [];

        for (const { pattern, replacement } of forbiddenPatterns) {
            if (pattern.test(filtered)) {
                warnings.push({
                    severity: 'critical',
                    type: 'financial_certainty',
                    message: '断定的金銭表現を検出'
                });
                filtered = filtered.replace(pattern, replacement);
            }
        }

        return { filtered, warnings };
    }
};

/**
 * 法律・倫理フィルター
 * 不倫等の不適切な助長表現を検出
 */
const LEGAL_FILTER: SafetyFilter = {
    name: 'legal',
    category: ['love', 'relationship'],
    check: (output, context) => {
        const criticalPatterns = [
            /不倫(を|で)(しても|すれば|続け)/g,
            /隠し続け/g,
            /バレないように/g,
            /秘密にし続け/g
        ];

        const warnings: Warning[] = [];

        for (const pattern of criticalPatterns) {
            if (pattern.test(output) || pattern.test(context.question || '')) {
                warnings.push({
                    severity: 'critical',
                    type: 'legal_encouragement',
                    message: '不適切な助長表現を検出'
                });
                // クリティカルな場合は出力を空にして後でSAFETY_LINEに差し替え
                return { filtered: '', warnings };
            }
        }

        return { filtered: output, warnings };
    }
};

/**
 * 自傷他害フィルター
 * 深刻なリスクを検出し、支援導線に誘導
 */
const HARM_FILTER: SafetyFilter = {
    name: 'harm',
    category: ['love', 'work', 'money', 'health', 'relationship', 'family'],
    check: (output, context) => {
        const criticalPatterns = [
            /死にたい/g,
            /自殺/g,
            /殺(す|し|された)/g,
            /復讐/g,
            /消えたい/g
        ];

        // 出力と質問文の両方をチェック
        const combinedText = output + ' ' + (context.question || '');

        for (const pattern of criticalPatterns) {
            if (pattern.test(combinedText)) {
                return {
                    filtered: '',
                    warnings: [{
                        severity: 'critical',
                        type: 'self_harm',
                        message: '自傷他害リスクを検出'
                    }]
                };
            }
        }

        return { filtered: output, warnings: [] };
    }
};

/**
 * SAFETY_LINE（安全導線テキスト）
 */
const SAFETY_LINES: Record<string, string> = {
    health_diagnosis: `健康に関するお悩みは、医療の専門家にご相談ください。

**相談先**
- かかりつけ医
- 健康相談ホットライン: #8000
- 各自治体の健康相談窓口`,

    self_harm: `つらいお気持ちを一人で抱え込まないでください。
専門の相談員があなたの話を聞いてくれます。

**相談先**
- いのちの電話: 0570-783-556（24時間）
- こころの健康相談統一ダイヤル: 0570-064-556
- よりそいホットライン: 0120-279-338（24時間）`,

    legal_encouragement: `より良い関係性を築くために、専門家の力を借りることも選択肢の一つです。

**相談先**
- カウンセリングサービス
- 法律相談窓口
- 各自治体の家庭相談窓口`,

    default: `このご相談内容については、専門家にご相談されることをお勧めします。

**一般的な相談先**
- カウンセリングサービス
- 各自治体の総合相談窓口`
};

/**
 * カテゴリとリスクタイプに応じたSAFETY_LINEを取得
 */
export function getSafetyLine(_category: Category, riskType: string): string {
    return SAFETY_LINES[riskType] || SAFETY_LINES.default;
}

/**
 * 安全フィルターパイプラインを適用
 * 
 * @param category - カテゴリ
 * @param output - フィルター前の出力テキスト
 * @param context - ユーザーコンテキスト
 * @returns フィルター適用後の安全な出力
 */
export function applySafetyFilters(
    category: Category,
    output: string,
    context: UserContext
): SafeOutput {
    const filters: SafetyFilter[] = [
        HEALTH_FILTER,
        FINANCIAL_FILTER,
        LEGAL_FILTER,
        HARM_FILTER
    ];

    let result = output;
    let allWarnings: Warning[] = [];

    // 各フィルターを順次適用
    for (const filter of filters) {
        // カテゴリが対象外の場合はスキップ
        if (!filter.category.includes(category)) {
            continue;
        }

        const filterResult = filter.check(result, context);
        result = filterResult.filtered;
        allWarnings.push(...filterResult.warnings);
    }

    // クリティカルな警告がある場合はSAFETY_LINEに差し替え
    const criticalWarning = allWarnings.find(w => w.severity === 'critical');

    if (criticalWarning) {
        return {
            output: getSafetyLine(category, criticalWarning.type),
            blocked: true,
            warnings: allWarnings
        };
    }

    return {
        output: result,
        blocked: false,
        warnings: allWarnings
    };
}
