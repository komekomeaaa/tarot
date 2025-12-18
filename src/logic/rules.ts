import type { DrawnCard } from '../types';

/**
 * 解釈レイヤー
 */
export type InterpretationLayer =
    | 'safety'
    | 'major_arcana'
    | 'sigil_core'
    | 'position'
    | 'synergy';

/**
 * レイヤーの優先順位設定
 */
export interface LayerPriority {
    layer: InterpretationLayer;
    weight: number; // 0-1
}

/**
 * 競合解決戦略
 */
export type ConflictResolutionStrategy =
    | 'sigil_優先'
    | 'card_優先'
    | 'position_dependent'
    | 'merge';

/**
 * 競合条件
 */
export interface ConflictCondition {
    sigil?: string;
    card?: {
        suit?: string;
        orientation?: 'upright' | 'reversed';
        rank?: string;
    };
    position?: string;
}

/**
 * 競合解決ルール
 */
export interface ConflictRule {
    condition: ConflictCondition;
    resolution: {
        strategy: ConflictResolutionStrategy;
        rules?: Record<string, ConflictResolutionStrategy>;
    };
}

/**
 * 出力制約
 */
export interface OutputConstraints {
    maxSuggestions: number;
    minConfidence: number;
    maxLength?: {
        thesis?: number;
        advice?: number;
        ritual?: number;
    };
}

/**
 * 解釈ルール設定
 */
export interface InterpretationRules {
    priority: LayerPriority[];
    conflicts: ConflictRule[];
    constraints: OutputConstraints;
}

/**
 * デフォルトの解釈ルール
 */
export const INTERPRETATION_RULES: InterpretationRules = {
    // レイヤー優先順位（上から順に適用）
    priority: [
        { layer: 'safety', weight: 1.0 },        // 安全フィルターが最優先
        { layer: 'major_arcana', weight: 0.9 },  // 大アルカナは強い
        { layer: 'sigil_core', weight: 0.8 },    // シジルのコア特性
        { layer: 'position', weight: 0.7 },      // スプレッド位置
        { layer: 'synergy', weight: 0.6 }        // 相互作用は補助的
    ],

    // 競合解決ルール
    conflicts: [
        {
            // V型（行動推進）× Swords逆位置（停止）の競合
            condition: {
                sigil: 'V',
                card: { suit: 'swords', orientation: 'reversed' }
            },
            resolution: {
                strategy: 'position_dependent',
                rules: {
                    advice: 'sigil_優先',    // 助言では「動け」
                    guidance: 'sigil_優先',
                    obstacle: 'card_優先',    // 障害では「止まれ」
                    challenge: 'card_優先'
                }
            }
        },
        {
            // S型（慎重）× Wands正位置（行動加速）の競合
            condition: {
                sigil: 'S',
                card: { suit: 'wands', orientation: 'upright' }
            },
            resolution: {
                strategy: 'merge' // 「慎重に行動」として統合
            }
        },
        {
            // 大アルカナは常に優先
            condition: {
                card: { suit: 'major' }
            },
            resolution: {
                strategy: 'card_優先'
            }
        }
    ],

    // 出力制約
    constraints: {
        maxSuggestions: 3,
        minConfidence: 0.6,
        maxLength: {
            thesis: 200,
            advice: 150,
            ritual: 100
        }
    }
};

/**
 * 競合を検出
 */
export function detectConflict(
    _card: DrawnCard,
    sigilType: string,
    position: string
): ConflictRule | null {
    const sigilChar = sigilType[0]; // 最初の文字（コア特性）

    for (const rule of INTERPRETATION_RULES.conflicts) {
        const { condition } = rule;

        // シジル条件のチェック
        if (condition.sigil && condition.sigil !== sigilChar) {
            continue;
        }

        // カード条件のチェック
        if (condition.card) {
            // カードの情報を取得する必要がある場合は、
            // ここで card.cardId から詳細を取得
            // 今回は簡易実装として、条件が一致すればマッチとする
        }

        // 位置条件のチェック
        if (condition.position && condition.position !== position) {
            continue;
        }

        // すべての条件が一致
        return rule;
    }

    return null;
}

/**
 * 競合を解決
 */
export function resolveConflict(
    conflict: ConflictRule,
    position: string,
    sigilInterpretation: string,
    cardInterpretation: string
): string {
    const { strategy, rules } = conflict.resolution;

    if (strategy === 'position_dependent' && rules) {
        const positionStrategy = rules[position];
        if (positionStrategy === 'sigil_優先') {
            return sigilInterpretation;
        } else if (positionStrategy === 'card_優先') {
            return cardInterpretation;
        }
    }

    if (strategy === 'sigil_優先') {
        return sigilInterpretation;
    }

    if (strategy === 'card_優先') {
        return cardInterpretation;
    }

    if (strategy === 'merge') {
        // シジルとカードの解釈を統合
        return `${sigilInterpretation}。しかし、${cardInterpretation}`;
    }

    // デフォルトはカード優先
    return cardInterpretation;
}

/**
 * レイヤーの優先度を取得
 */
export function getLayerWeight(layer: InterpretationLayer): number {
    const priority = INTERPRETATION_RULES.priority.find(p => p.layer === layer);
    return priority?.weight ?? 0.5;
}

/**
 * 出力制約を適用
 */
export function applyConstraints(text: string, type: 'thesis' | 'advice' | 'ritual'): string {
    const maxLength = INTERPRETATION_RULES.constraints.maxLength?.[type];

    if (maxLength && text.length > maxLength) {
        // 最大長を超える場合は切り詰め
        return text.substring(0, maxLength - 3) + '...';
    }

    return text;
}
