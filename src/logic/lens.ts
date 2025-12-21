import type { DrawnCard, CardDefinition } from '../types';
import { CARDS } from '../data/cards';

export interface LensRule {
    condition: (card: CardDefinition, position: string, drawn: DrawnCard) => boolean;
    messageTemplate: string;
}

// カード定義を取得するヘルパー
function getCard(cardId: string): CardDefinition | undefined {
    return CARDS.find(c => c.id === cardId);
}

// 共通条件
const isMajor = (c: CardDefinition) => c.arcana === 'major';
const isReversed = (_c: CardDefinition, _p: string, d: DrawnCard) => d.orientation === 'reversed';
const isUpright = (_c: CardDefinition, _p: string, d: DrawnCard) => d.orientation === 'upright';
// const isSuit = (c: CardDefinition, suit: string) => c.suit === suit; // 未使用のためコメントアウト

// タイプごとのLensルール定義
const LENS_RULES: Record<string, LensRule[]> = {
    // === Visionary types (V) ===
    VIEQ: [
        {
            condition: isMajor,
            messageTemplate: "この大きな流れは、新しい道を拓くチャンスです。直感を信じて飛び込んでください。"
        },
        {
            condition: (c) => c.suit === 'wands',
            messageTemplate: "情熱の火が灯っています。理屈より先に、まずは動いてみることです。"
        }
    ],
    VIED: [
        {
            condition: isMajor,
            messageTemplate: "大きな力が働いています。これを決定的な好機と捉え、覚悟を決めてください。"
        },
        {
            condition: (c) => typeof c.rank === 'string' && ['king', 'queen'].includes(c.rank),
            messageTemplate: "リーダーシップを発揮する時です。周りを待たず、あなたが決断を下してください。"
        }
    ],
    VILEQ: [
        {
            condition: (c) => c.suit === 'swords',
            messageTemplate: "論理的な突破口が見えます。感情論を排し、事実だけで戦略を立ててください。"
        },
        {
            condition: isReversed,
            messageTemplate: "矛盾が生じています。しかし、その矛盾こそが攻めるべき急所です。"
        }
    ],
    VILD: [
        {
            condition: isReversed,
            messageTemplate: "システムのバグ（不具合）が見つかりました。修復するより、仕組み自体を書き換える好機です。"
        },
        {
            condition: (c) => c.suit === 'pentacles',
            messageTemplate: "構造的な再構築が必要です。一時的な利益より、長期的なシステム作りを優先してください。"
        }
    ],

    // V-Terra
    VCEQ: [
        {
            condition: (c) => c.suit === 'cups' || !!c.rank, // 人物札 or Cups
            messageTemplate: "キーマンとの連携が鍵です。一人で進めず、周囲を巻き込んで流れを作ってください。"
        }
    ],
    VCED: [
        {
            condition: (c) => c.suit === 'pentacles',
            messageTemplate: "美しい計画より、目に見える成果が必要です。今日できる具体的な一手を打ってください。"
        }
    ],
    VCLEQ: [
        {
            condition: isUpright,
            messageTemplate: "最短ルートが見えています。無駄を省き、効率的に結果を取りに行きましょう。"
        }
    ],
    VCLD: [
        {
            condition: isReversed,
            messageTemplate: "流れが滞っています。全体のボトルネックを特定し、そこだけを通せば全体が回ります。"
        }
    ],

    // === Safety types (S) ===
    SIEQ: [
        {
            condition: (c) => c.id.includes('MOON') || c.suit === 'cups',
            messageTemplate: "事実確認より、あなたの「違和感」が正解です。内なる声に従ってください。"
        }
    ],
    SIED: [
        {
            condition: isReversed,
            messageTemplate: "無理に動く必要はありません。波が静まるのを待つのも、賢明な戦略です。"
        }
    ],
    SILEQ: [
        {
            condition: isReversed,
            messageTemplate: "外の敵より、自分の中の矛盾と向き合う時です。言動と本音は一致していますか？"
        }
    ],
    SILD: [
        {
            condition: (c) => c.id.includes('HIEROPHANT') || c.id.includes('EMPEROR'),
            messageTemplate: "独創性はリスクです。先例や確かなガイドラインに従うのが最も安全な道です。"
        }
    ],

    // S-Terra
    SCEQ: [
        {
            condition: (c) => c.suit === 'cups' || c.id.includes('EMPRESS'),
            messageTemplate: "急ぐ必要はありません。今は結果より、大切なものを守り育てることを優先してください。"
        }
    ],
    SCED: [
        {
            condition: (c) => c.id.includes('TOWER') || c.id.includes('DEVIL'),
            messageTemplate: "楽観視は禁物です。最悪のケースを想定し、守りを十分に固めてください。"
        }
    ],
    SCLEQ: [
        {
            condition: (c) => c.id.includes('JUSTICE') || c.id.includes('TEMPERANCE'),
            messageTemplate: "どちらかに偏りすぎていませんか？前進するより、まずはバランスの調整が必要です。"
        }
    ],
    SCLD: [
        {
            condition: (c) => c.suit === 'pentacles',
            messageTemplate: "冒険は不要です。まずは足元を固め、揺るぎない基盤を作ることに集中してください。"
        }
    ]
};



/**
 * Lensメッセージを取得
 */
export function getLensMessage(
    sigilType: string,
    drawnCard: DrawnCard
): string | null {
    const card = getCard(drawnCard.cardId);
    if (!card) return null;

    const rules = LENS_RULES[sigilType] || [];

    // ルールを順に評価し、最初にマッチしたものを返す
    for (const rule of rules) {
        if (rule.condition(card, drawnCard.positionId, drawnCard)) {
            return rule.messageTemplate;
        }
    }

    // デフォルトルール（V型ならポジティブ、S型なら慎重に）
    if (sigilType.startsWith('V')) {
        return "あなたの変革力が必要な場面です。恐れずに一歩を踏み出してください。";
    } else if (sigilType.startsWith('S')) {
        return "慎重さが強みになる場面です。焦らず、足元を確かめてから進みましょう。";
    }

    return null;
}
