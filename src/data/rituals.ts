// 今日の一手（ACTION_RITUAL）データ
// スート別・カテゴリ別の行動提案

export interface Ritual {
    id: string;
    text: string;
    suits: ('wands' | 'cups' | 'swords' | 'pentacles' | 'major')[];
    categories: ('love' | 'work' | 'money' | 'health' | 'relationship' | 'family' | 'all')[];
    forReversed?: boolean; // 逆位置多数時専用
}

export const RITUALS: Ritual[] = [
    // 汎用（全スート対応）
    {
        id: 'general_01',
        text: '5分だけ、今の気持ちを紙に書き出してください。正解を探さず、出てくる言葉をそのまま書くだけでOKです。',
        suits: ['major', 'wands', 'cups', 'swords', 'pentacles'],
        categories: ['all']
    },
    {
        id: 'general_02',
        text: '今日中に「確認したいこと」を1つだけ言語化してください。全部を解決しようとせず、1つに絞ることで流れが動きます。',
        suits: ['major', 'wands', 'cups', 'swords', 'pentacles'],
        categories: ['all']
    },

    // Wands（意欲・推進）
    {
        id: 'wands_01',
        text: '今日中に「やりたいこと」を1つだけ5分で着手してください。完了しなくてOK、"始めた事実"が流れを作ります。',
        suits: ['wands'],
        categories: ['all']
    },
    {
        id: 'wands_02',
        text: '今日の優先順位を3つ書き出し、一番上だけを完了させてください。残りは明日に回してOKです。',
        suits: ['wands'],
        categories: ['work']
    },
    {
        id: 'wands_03',
        text: '軽い運動（ストレッチ、散歩）を5分だけ。身体を動かすと意欲も動きます。',
        suits: ['wands'],
        categories: ['health']
    },

    // Cups（感情・関係）
    {
        id: 'cups_01',
        text: '今日、1人だけに「ありがとう」か「お疲れさま」を伝えてください。重い話は不要です。',
        suits: ['cups'],
        categories: ['love', 'relationship', 'family']
    },
    {
        id: 'cups_02',
        text: '好きな飲み物を用意して、5分だけ何もせず味わってください。感情の回復はここから始まります。',
        suits: ['cups'],
        categories: ['health', 'all']
    },
    {
        id: 'cups_03',
        text: '今日は「相手に何かを期待しない」をテーマにしてください。求めないほど反応が返りやすくなります。',
        suits: ['cups'],
        categories: ['love', 'relationship']
    },

    // Swords（思考・判断）
    {
        id: 'swords_01',
        text: '今日のモヤモヤを「事実」と「感情」に分けて書き出してください。分けるだけで判断が軽くなります。',
        suits: ['swords'],
        categories: ['all']
    },
    {
        id: 'swords_02',
        text: '今日中に「やらないこと」を1つ決めてください。増やすより減らす方が頭がクリアになります。',
        suits: ['swords'],
        categories: ['work']
    },
    {
        id: 'swords_03',
        text: '5分だけ、何も考えずに深呼吸してください。思考の過負荷は休息で回復します。',
        suits: ['swords'],
        categories: ['health']
    },

    // Pentacles（現実・継続）
    {
        id: 'pentacles_01',
        text: '今日中に「1つだけ」片付けてください。机の上、財布の中、1か所だけでOKです。',
        suits: ['pentacles'],
        categories: ['all']
    },
    {
        id: 'pentacles_02',
        text: '今週の支出を1つだけ確認してください。全部見なくてOK、1つ見るだけで意識が変わります。',
        suits: ['pentacles'],
        categories: ['money']
    },
    {
        id: 'pentacles_03',
        text: '今日中に「次にやること」を1つだけメモしてください。書いておくと安心して休めます。',
        suits: ['pentacles'],
        categories: ['work']
    },

    // 大アルカナ（人生テーマ）
    {
        id: 'major_01',
        text: '今日の問いを「なぜ？」から「どうする？」に変えてください。原因追求より行動設計が効きます。',
        suits: ['major'],
        categories: ['all']
    },
    {
        id: 'major_02',
        text: '今日は「決めないこと」を1つ決めてください。保留OK、決めないことを決めるのも決断です。',
        suits: ['major'],
        categories: ['all']
    },

    // 逆位置多数時専用（整える系）
    {
        id: 'reversed_01',
        text: '今日は"進める"より"整える"を優先してください。やることを増やさず、順番を決めるだけでOKです。',
        suits: ['major', 'wands', 'cups', 'swords', 'pentacles'],
        categories: ['all'],
        forReversed: true
    },
    {
        id: 'reversed_02',
        text: '今日中に「今週の予定」を1つだけ減らしてください。空白を作ると回復が始まります。',
        suits: ['major', 'wands', 'cups', 'swords', 'pentacles'],
        categories: ['all'],
        forReversed: true
    },
    {
        id: 'reversed_03',
        text: '5分だけ、何も判断せずに目を閉じてください。内側を整える時間が必要な局面です。',
        suits: ['major', 'wands', 'cups', 'swords', 'pentacles'],
        categories: ['all'],
        forReversed: true
    }
];

// 条件に合うRitualを選択
export function selectRitual(
    dominantSuit: 'wands' | 'cups' | 'swords' | 'pentacles' | null,
    category: string,
    reversedRatio: number
): string {
    // 逆位置比率が高い場合は整える系優先
    if (reversedRatio >= 0.6) {
        const reversedRituals = RITUALS.filter(r => r.forReversed);
        if (reversedRituals.length > 0) {
            const idx = Math.floor(Math.random() * reversedRituals.length);
            return reversedRituals[idx].text;
        }
    }

    // スートとカテゴリでフィルタ
    let candidates = RITUALS.filter(r => {
        if (r.forReversed) return false; // 逆位置専用は除外

        const suitMatch = !dominantSuit ||
            r.suits.includes(dominantSuit) ||
            r.suits.includes('major');

        const categoryMatch = r.categories.includes('all') ||
            r.categories.includes(category as any);

        return suitMatch && categoryMatch;
    });

    // マッチするものがなければ汎用から
    if (candidates.length === 0) {
        candidates = RITUALS.filter(r =>
            !r.forReversed && r.categories.includes('all')
        );
    }

    // ランダム選択
    const idx = Math.floor(Math.random() * candidates.length);
    return candidates[idx]?.text || '今日は1つだけ、自分のために時間を取ってください。';
}
