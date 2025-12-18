/**
 * シジルタイプとタロット要素の相互作用（シナジー）を計算
 * Phase 2後半: パーソナライズ精度向上
 */

export type SynergyType = 'acceleration' | 'balance' | 'warning' | 'challenge';

/**
 * シジル×スート相互作用の定義
 */
export interface SigilSuitSynergy {
    sigilChar: string;
    dominantSuit: 'wands' | 'cups' | 'swords' | 'pentacles';
    type: SynergyType;
    modifier: string;
    strength: number; // 0-1
}

/**
 * シジル文字の定義
 */
const SIGIL_CHARS = {
    V: { name: 'ヴィジョナリー', trait: '行動推進' },
    S: { name: 'セーフティ', trait: '慎重確認' },
    I: { name: 'イントロスペクト', trait: '内省深化' },
    E: { name: 'エクスプレス', trait: '表現発信' },
    C: { name: 'コネクト', trait: '繋がり重視' },
    L: { name: 'ロジック', trait: '論理分析' },
    Q: { name: 'クエスチョン', trait: '探求質問' },
    D: { name: 'ディサイド', trait: '決断実行' }
} as const;

/**
 * シジル文字とスートの相互作用マトリックス
 * 
 * 16パターン（主要4文字 × 4スート）を定義
 * これにより同じカードでもユーザータイプで助言が変わる
 */
export const SIGIL_SUIT_SYNERGIES: SigilSuitSynergy[] = [
    // V型（行動推進）の相互作用
    {
        sigilChar: 'V',
        dominantSuit: 'wands',
        type: 'acceleration',
        modifier: '行動の流れに乗っています。勢いを活かして一気に進めましょう',
        strength: 0.9
    },
    {
        sigilChar: 'V',
        dominantSuit: 'cups',
        type: 'warning',
        modifier: '感情に流されやすい時期。冷静さを保ちつつ動きましょう',
        strength: 0.7
    },
    {
        sigilChar: 'V',
        dominantSuit: 'swords',
        type: 'balance',
        modifier: '考えと行動のバランスが取れています。計画的に進めてください',
        strength: 0.8
    },
    {
        sigilChar: 'V',
        dominantSuit: 'pentacles',
        type: 'acceleration',
        modifier: '現実的な成果を出す絶好の機会。確実に形にしていきましょう',
        strength: 0.85
    },

    // S型（慎重確認）の相互作用
    {
        sigilChar: 'S',
        dominantSuit: 'wands',
        type: 'balance',
        modifier: '慎重に行動する時期。焦らず一歩ずつ確認しながら進みましょう',
        strength: 0.8
    },
    {
        sigilChar: 'S',
        dominantSuit: 'cups',
        type: 'acceleration',
        modifier: '感情を丁寧に扱うあなたの強みが活きています',
        strength: 0.85
    },
    {
        sigilChar: 'S',
        dominantSuit: 'swords',
        type: 'warning',
        modifier: '考えすぎて動けなくなっています。小さな一歩から始めましょう',
        strength: 0.75
    },
    {
        sigilChar: 'S',
        dominantSuit: 'pentacles',
        type: 'acceleration',
        modifier: '着実に積み上げる時期。あなたの慎重さが成果に繋がります',
        strength: 0.9
    },

    // I型（内省深化）の相互作用
    {
        sigilChar: 'I',
        dominantSuit: 'wands',
        type: 'challenge',
        modifier: '内側のエネルギーを外に出す時。思い切って行動してみましょう',
        strength: 0.7
    },
    {
        sigilChar: 'I',
        dominantSuit: 'cups',
        type: 'acceleration',
        modifier: '内なる感情と向き合う時期。あなたの得意分野です',
        strength: 0.9
    },
    {
        sigilChar: 'I',
        dominantSuit: 'swords',
        type: 'acceleration',
        modifier: '深く考察する時期。内省を通じて答えが見つかります',
        strength: 0.85
    },
    {
        sigilChar: 'I',
        dominantSuit: 'pentacles',
        type: 'balance',
        modifier: '内面の充実が現実的な成果に繋がります',
        strength: 0.8
    },

    // E型（表現発信）の相互作用
    {
        sigilChar: 'E',
        dominantSuit: 'wands',
        type: 'acceleration',
        modifier: 'あなたの表現力と行動力が最大限に発揮される時期です',
        strength: 0.95
    },
    {
        sigilChar: 'E',
        dominantSuit: 'cups',
        type: 'balance',
        modifier: '感情を豊かに表現できる時期。相手に伝わりやすい状態です',
        strength: 0.85
    },
    {
        sigilChar: 'E',
        dominantSuit: 'swords',
        type: 'balance',
        modifier: '考えを的確に伝える時期。論理と表現のバランスが良好です',
        strength: 0.8
    },
    {
        sigilChar: 'E',
        dominantSuit: 'pentacles',
        type: 'challenge',
        modifier: '言葉だけでなく、目に見える形で示す必要があります',
        strength: 0.7
    }
];

/**
 * スート分布から支配的なスートを取得
 */
export function getDominantSuit(
    suitDistribution: Record<string, number>
): 'wands' | 'cups' | 'swords' | 'pentacles' | null {
    // majorを除外
    const minorSuits = ['wands', 'cups', 'swords', 'pentacles'];
    const counts = minorSuits.map(suit => ({
        suit,
        count: suitDistribution[suit] || 0
    }));

    counts.sort((a, b) => b.count - a.count);

    // 最多スートが2枚以上の場合のみ「支配的」と判断
    if (counts[0].count >= 2) {
        return counts[0].suit as 'wands' | 'cups' | 'swords' | 'pentacles';
    }

    return null;
}

/**
 * シジルタイプとスート偏りの相互作用を計算
 * 
 * @param sigilType - ユーザーのシジルタイプ（例: "VEQD"）
 * @param suitDistribution - スートごとのカード枚数
 * @returns 相互作用情報、または該当なしの場合null
 */
export function calculateSigilSuitSynergy(
    sigilType: string,
    suitDistribution: Record<string, number>
): SigilSuitSynergy | null {
    if (!sigilType || sigilType.length === 0) {
        return null;
    }

    // コア特性（最初の文字）を使用
    const sigilChar = sigilType[0];

    // 支配的なスートを特定
    const dominantSuit = getDominantSuit(suitDistribution);

    if (!dominantSuit) {
        return null; // スートが分散している場合
    }

    // 該当する相互作用を検索
    const synergy = SIGIL_SUIT_SYNERGIES.find(
        s => s.sigilChar === sigilChar && s.dominantSuit === dominantSuit
    );

    return synergy || null;
}

/**
 * 逆位置比率に基づくシジル調整
 * 
 * @param sigilType - ユーザーのシジルタイプ
 * @param reversedRatio - 逆位置の比率（0-1）
 * @returns 調整メッセージ
 */
export function adjustByReversedRatio(
    sigilType: string,
    reversedRatio: number
): string {
    if (!sigilType || reversedRatio < 0.5) {
        return ''; // 逆位置が少ない場合は特別な調整なし
    }

    const isIntroverted = sigilType.includes('I');

    if (reversedRatio >= 0.7) {
        // 70%以上が逆位置 = 強い内向きフェーズ
        if (isIntroverted) {
            return '内省の時期です。あなたの得意な「内側を整える」フェーズ。じっくり自分と向き合いましょう';
        } else {
            return '外に出しにくい時期です。焦らず、まずは自分の内側と向き合う時間を持ちましょう';
        }
    } else {
        // 50-70%が逆位置 = 中程度の調整フェーズ
        if (isIntroverted) {
            return '内面を見つめ直す時期。あなたに合ったペースです';
        } else {
            return '少し立ち止まって整理する時期。次のステップへの準備をしましょう';
        }
    }
}

/**
 * シナジー情報を読みやすいテキストに変換
 */
export function formatSynergyMessage(synergy: SigilSuitSynergy): string {
    const typeEmoji = {
        acceleration: '⚡',
        balance: '⚖️',
        warning: '⚠️',
        challenge: '🎯'
    };

    const emoji = typeEmoji[synergy.type] || '';
    return `${emoji} ${synergy.modifier}`;
}

/**
 * シジル文字の説明を取得
 */
export function getSigilCharInfo(char: string): { name: string; trait: string } | null {
    return SIGIL_CHARS[char as keyof typeof SIGIL_CHARS] || null;
}
