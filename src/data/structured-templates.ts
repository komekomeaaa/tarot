/**
 * 構造化テンプレートシステム
 * Phase 3: バリエーション拡充とシジル対応
 */

import type { Category } from '../types';

/**
 * テンプレートコンポーネントの種類
 */
export type ComponentType = 'timeframe' | 'subject' | 'effect' | 'action';

/**
 * 言語トーン
 */
export type Tone = 'direct' | 'gentle' | 'analytical' | 'mystical';

/**
 * テンポ
 */
export type Tempo = 'fast' | 'normal' | 'slow';

/**
 * 構造化テンプレートの定義
 */
export interface StructuredTemplate {
    id: string;
    structure: string; // 例: "timeframe + subject + effect"
    components: {
        timeframe?: string[];
        subject?: string[];
        effect?: string[];
        action?: string[];
    };
    modifiers: {
        [sigilChar: string]: {
            tone: Tone;
            tempo: Tempo;
            emphasis?: string; // 強調する要素
        };
    };
}

/**
 * カテゴリ × シジル × カードの統合テンプレート
 */
export interface CategorySigilCardTemplate {
    id: string;
    category: Category;
    sigilChar: string; // V, S, I, E, C, L, Q, D
    cardPattern: string; // 'cups', 'wands', 'swords', 'pentacles', 'major'
    advice: string;
    ritual: string;
    strength: number; // 0-1, このテンプレートの推奨度
}

/**
 * 位置別の構造化テンプレート
 */
export const STRUCTURED_POSITION_TEMPLATES: Record<string, StructuredTemplate> = {
    past_upright: {
        id: 'past_upright',
        structure: 'timeframe + subject + effect',
        components: {
            timeframe: ['過去において', 'かつて', '以前', 'これまで'],
            subject: ['{CARD}が示すのは', '{CARD}は', '{CARD}が語るのは'],
            effect: ['{KW}です', '{KW}という要素でした', '{KW}が鍵でした', '{KW}が土台となっています']
        },
        modifiers: {
            V: { tone: 'direct', tempo: 'fast', emphasis: 'effect' },
            S: { tone: 'gentle', tempo: 'slow', emphasis: 'timeframe' },
            I: { tone: 'analytical', tempo: 'slow', emphasis: 'subject' },
            E: { tone: 'direct', tempo: 'fast', emphasis: 'effect' }
        }
    },

    present_upright: {
        id: 'present_upright',
        structure: 'subject + effect + action',
        components: {
            subject: ['現在', '今', 'この瞬間'],
            effect: ['{CARD}が示す{KW}の状態にあります', '{KW}というエネルギーに包まれています'],
            action: ['この流れを活かしましょう', 'この状態を受け入れましょう', 'この機会を捉えてください']
        },
        modifiers: {
            V: { tone: 'direct', tempo: 'fast', emphasis: 'action' },
            S: { tone: 'gentle', tempo: 'normal', emphasis: 'effect' },
            I: { tone: 'analytical', tempo: 'slow', emphasis: 'effect' },
            E: { tone: 'direct', tempo: 'fast', emphasis: 'action' }
        }
    },

    obstacle_upright: {
        id: 'obstacle_upright',
        structure: 'subject + effect + action',
        components: {
            subject: ['障害として', '課題として', '乗り越えるべきものとして'],
            effect: ['{CARD}が示す{KW}が立ちはだかっています', '{KW}があなたの前に現れています'],
            action: ['これを認識することが第一歩です', 'これに向き合う必要があります', 'これを理解して進みましょう']
        },
        modifiers: {
            V: { tone: 'direct', tempo: 'fast', emphasis: 'action' },
            S: { tone: 'gentle', tempo: 'slow', emphasis: 'effect' },
            I: { tone: 'analytical', tempo: 'slow', emphasis: 'subject' },
            E: { tone: 'gentle', tempo: 'normal', emphasis: 'action' }
        }
    },

    advice_upright: {
        id: 'advice_upright',
        structure: 'action + effect',
        components: {
            action: ['進むべき道は', '取るべき行動は', '鍵となるのは'],
            effect: ['{CARD}が示す{KW}です', '{KW}を意識することです', '{KW}を実践することです']
        },
        modifiers: {
            V: { tone: 'direct', tempo: 'fast', emphasis: 'action' },
            S: { tone: 'gentle', tempo: 'normal', emphasis: 'effect' },
            I: { tone: 'analytical', tempo: 'slow', emphasis: 'effect' },
            E: { tone: 'direct', tempo: 'fast', emphasis: 'action' }
        }
    }
};

/**
 * カテゴリ × シジル × タロット 統合テンプレート（ホットパス）
 * 恋愛カテゴリ × 主要4シジル × 4スート = 16パターンを優先実装
 */
export const CATEGORY_SIGIL_CARD_TEMPLATES: CategorySigilCardTemplate[] = [
    // 恋愛 × V型（行動推進）
    {
        id: 'love_V_cups',
        category: 'love',
        sigilChar: 'V',
        cardPattern: 'cups',
        advice: '素直な気持ちを行動で示しましょう。感情を大切にしながらも、一歩踏み出すことが鍵です',
        ritual: '今日、相手に感謝の気持ちを言葉で伝える',
        strength: 0.9
    },
    {
        id: 'love_V_wands',
        category: 'love',
        sigilChar: 'V',
        cardPattern: 'wands',
        advice: '情熱的に動く時期。あなたの積極性が関係を前進させます',
        ritual: '今日、デートやお誘いのアクションを起こす',
        strength: 0.95
    },
    {
        id: 'love_V_swords',
        category: 'love',
        sigilChar: 'V',
        cardPattern: 'swords',
        advice: '思考を整理してから行動しましょう。考えすぎず、でも無思慮にならず',
        ritual: '今日、自分の気持ちをノートに書き出してから相手に伝える',
        strength: 0.8
    },
    {
        id: 'love_V_pentacles',
        category: 'love',
        sigilChar: 'V',
        cardPattern: 'pentacles',
        advice: '具体的な行動で愛を示す時期。形に残るものを大切に',
        ritual: '今日、相手にプレゼントや手紙など、形あるものを贈る',
        strength: 0.85
    },

    // 恋愛 × S型（慎重確認）
    {
        id: 'love_S_cups',
        category: 'love',
        sigilChar: 'S',
        cardPattern: 'cups',
        advice: '感情を丁寧に確認しながら進めましょう。焦らず、お互いの気持ちを大切に',
        ritual: '今日、相手の話をじっくり聞く時間を作る',
        strength: 0.9
    },
    {
        id: 'love_S_wands',
        category: 'love',
        sigilChar: 'S',
        cardPattern: 'wands',
        advice: '慎重に、でも勇気を持って。小さな一歩から始めましょう',
        ritual: '今日、小さなサプライズや気遣いを一つ実践する',
        strength: 0.8
    },
    {
        id: 'love_S_swords',
        category: 'love',
        sigilChar: 'S',
        cardPattern: 'swords',
        advice: '冷静に状況を見極める時期。分析と観察を大切に',
        ritual: '今日、関係性を客観的に振り返る時間を持つ',
        strength: 0.85
    },
    {
        id: 'love_S_pentacles',
        category: 'love',
        sigilChar: 'S',
        cardPattern: 'pentacles',
        advice: '確実に積み上げていく時期。安定した関係を築きましょう',
        ritual: '今日、2人の将来について具体的に話し合う',
        strength: 0.9
    },

    // 恋愛 × I型（内省深化）
    {
        id: 'love_I_cups',
        category: 'love',
        sigilChar: 'I',
        cardPattern: 'cups',
        advice: '自分の感情と深く向き合う時期。内なる声に耳を傾けましょう',
        ritual: '今日、一人の時間を作り、自分の本当の気持ちを確認する',
        strength: 0.95
    },
    {
        id: 'love_I_wands',
        category: 'love',
        sigilChar: 'I',
        cardPattern: 'wands',
        advice: '内側の情熱を外に出す練習を。自分のペースで表現していきましょう',
        ritual: '今日、日記に自分の気持ちを書いてから、相手に少しだけ伝える',
        strength: 0.75
    },
    {
        id: 'love_I_swords',
        category: 'love',
        sigilChar: 'I',
        cardPattern: 'swords',
        advice: '思考と感情を整理する時期。あなたの分析力が役立ちます',
        ritual: '今日、関係性のメリット・デメリットを冷静に書き出す',
        strength: 0.9
    },
    {
        id: 'love_I_pentacles',
        category: 'love',
        sigilChar: 'I',
        cardPattern: 'pentacles',
        advice: '内面の充実が関係の土台になります。自分を大切にしましょう',
        ritual: '今日、自分を満たす時間を作る（好きなことをする）',
        strength: 0.8
    },

    // 恋愛 × E型（表現発信）
    {
        id: 'love_E_cups',
        category: 'love',
        sigilChar: 'E',
        cardPattern: 'cups',
        advice: '感情を豊かに表現できる時期。あなたの気持ちが相手に伝わりやすい状態です',
        ritual: '今日、愛情表現を言葉、態度、行動で3つ以上示す',
        strength: 0.95
    },
    {
        id: 'love_E_wands',
        category: 'love',
        sigilChar: 'E',
        cardPattern: 'wands',
        advice: '情熱を全開で表現しましょう。あなたのエネルギーが関係を輝かせます',
        ritual: '今日、デートプランを提案するなど、主導権を取る',
        strength: 0.95
    },
    {
        id: 'love_E_swords',
        category: 'love',
        sigilChar: 'E',
        cardPattern: 'swords',
        advice: '考えを的確に伝える時期。論理と感情のバランスを取りましょう',
        ritual: '今日、本音を整理してから、建設的に対話する',
        strength: 0.85
    },
    {
        id: 'love_E_pentacles',
        category: 'love',
        sigilChar: 'E',
        cardPattern: 'pentacles',
        advice: '言葉だけでなく、目に見える形で愛を示す必要があります',
        ritual: '今日、相手のために具体的な行動を一つ起こす（料理、掃除、プレゼントなど）',
        strength: 0.9
    }
];

/**
 * トーンに応じたコンポーネント選択
 */
export function selectByTone(options: string[], tone: Tone): string {
    const index = Math.floor(Math.random() * options.length);

    // トーンによって選択を調整（将来的にはより洗練された選択ロジック）
    if (tone === 'direct' && options.length > 1) {
        return options[0]; // 直球な1番目
    } else if (tone === 'gentle' && options.length > 2) {
        return options[1]; // 優しめな2番目
    } else if (tone === 'mystical' && options.length > 3) {
        return options[options.length - 1]; // 神秘的な最後
    }

    return options[index];
}

/**
 * テンポに応じたコンポーネント選択
 */
export function selectByTempo(options: string[], tempo: Tempo): string {
    const index = Math.floor(Math.random() * options.length);

    // テンポによって選択を調整
    if (tempo === 'fast' && options.length > 1) {
        return options[0]; // 短い1番目
    } else if (tempo === 'slow' && options.length > 2) {
        return options[options.length - 1]; // 長めの最後
    }

    return options[index];
}

/**
 * 構造化テンプレートから文章を生成
 */
export function generateFromStructuredTemplate(
    template: StructuredTemplate,
    sigilChar: string,
    cardName: string,
    keywords: string
): string {
    const modifier = template.modifiers[sigilChar] || { tone: 'direct' as Tone, tempo: 'normal' as Tempo };

    let result = '';

    // structureに従って組み立て
    const parts = template.structure.split(' + ').map(p => p.trim());

    for (const part of parts) {
        const component = template.components[part as ComponentType];
        if (!component || component.length === 0) continue;

        let selected: string;
        if (part === 'timeframe' || part === 'subject') {
            selected = selectByTone(component, modifier.tone);
        } else {
            selected = selectByTempo(component, modifier.tempo);
        }

        result += selected;
    }

    // プレースホルダーを置換
    result = result
        .replace(/{CARD}/g, cardName)
        .replace(/{KW}/g, keywords);

    return result;
}

/**
 * カテゴリ × シジル × カードの最適テンプレートを取得
 */
export function getCategorySigilCardTemplate(
    category: Category,
    sigilChar: string,
    cardSuit: string
): CategorySigilCardTemplate | null {
    // 完全一致を探す
    const exactMatch = CATEGORY_SIGIL_CARD_TEMPLATES.find(
        t => t.category === category && t.sigilChar === sigilChar && t.cardPattern === cardSuit
    );

    if (exactMatch) {
        return exactMatch;
    }

    // カテゴリとシジルが一致するものを探す（スートは無視）
    const partialMatch = CATEGORY_SIGIL_CARD_TEMPLATES.find(
        t => t.category === category && t.sigilChar === sigilChar
    );

    return partialMatch || null;
}
