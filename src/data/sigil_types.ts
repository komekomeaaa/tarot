// 16シジルタイプ定義
// 4軸: V/S (Catalyst/Ward), I/C (Aether/Terra), E/L (Chalice/Blade), Q/D (Spark/Rune)

export interface SigilType {
    code: string;      // e.g., "VIEQ"
    name: string;      // e.g., "Astra Seer"
    nameJp: string;    // e.g., "星読みの探求者"
    lens: string;      // TYPE_LENS用の1行補足
    keywords: string[]; // 特徴キーワード
    action_style: string; // 行動指針
}

// 16タイプ定義
export const SIGIL_TYPES: Record<string, SigilType> = {

    // === Visionary types (V - 変革) ===
    // Catalyst (V) + Aether (I) combinations
    VIEQ: {
        code: "VIEQ",
        name: "Astra Seer",
        nameJp: "星読みの探求者",
        lens: "理想を掲げ、直感的に本質を突く革新者。大局を見通す目を持つ。",
        keywords: ["Ideal", "Intuition", "Breakthrough"],
        action_style: "Start Small & Fast (直感を形にする)"
    },
    VIED: {
        code: "VIED",
        name: "Oracle Keeper",
        nameJp: "神託の守護者",
        lens: "理想を現実的な決断へと落とし込むカリスマ。揺るぎない信念で導く。",
        keywords: ["Vision", "Conviction", "Leadership"],
        action_style: "Commit (覚悟を決める)"
    },
    VILEQ: {
        code: "VILEQ",
        name: "Flame Philosopher",
        nameJp: "炎の哲学者",
        lens: "理想を論理的に構築し、熱く語る革命家。矛盾を許さない。",
        keywords: ["Logic", "Passion", "Argument"],
        action_style: "Strategize (論理で突破する)"
    },
    VILD: {
        code: "VILD",
        name: "Truth Weaver",
        nameJp: "真実の織り手",
        lens: "理想実現のため冷徹にシステムを構築する。真実を編み上げる。",
        keywords: ["System", "Strategy", "Reconstruction"],
        action_style: "Rebuild (仕組みを変える)"
    },

    // Catalyst (V) + Terra (C) combinations
    VCEQ: {
        code: "VCEQ",
        name: "Path Forger",
        nameJp: "道を拓く者",
        lens: "人との繋がりの中で新しい流れを作るムードメーカー。",
        keywords: ["Connection", "Flow", "Influence"],
        action_style: "Involve (人を巻き込む)"
    },
    VCED: {
        code: "VCED",
        name: "Stone Crafter",
        nameJp: "石の職人",
        lens: "確実に形にするための行動力を持つ現場監督。",
        keywords: ["Action", "Reality", "Production"],
        action_style: "Produce (形にする)"
    },
    VCLEQ: {
        code: "VCLEQ",
        name: "Steel Strategist",
        nameJp: "鋼の戦略家",
        lens: "現実的なデータに基づき、論理的かつ大胆に攻める。",
        keywords: ["Efficiency", "Victory", "Tactics"],
        action_style: "Optimize (最短距離を行く)"
    },
    VCLD: {
        code: "VCLD",
        name: "Structure Sage",
        nameJp: "構造の賢者",
        lens: "組織や仕組みの欠陥を見抜き、再構築する解決者。",
        keywords: ["Optimization", "Problem-Solving", "Structure"],
        action_style: "Fix Flow (滞りを通す)"
    },

    // === Safety types (S - 守護) ===
    // Ward (S) + Aether (I) combinations
    SIEQ: {
        code: "SIEQ",
        name: "Dream Walker",
        nameJp: "夢を歩く者",
        lens: "内なる世界を守り、独自の感性を育む芸術家。",
        keywords: ["Sensitivity", "Inner-World", "Artistry"],
        action_style: "Reflect (内面で味わう)"
    },
    SIED: {
        code: "SIED",
        name: "Still Water",
        nameJp: "静かなる水面",
        lens: "揺るぎない内面の静寂を持つ精神的支柱。",
        keywords: ["Serenity", "Acceptance", "Stability"],
        action_style: "Wait & Observe (静観する)"
    },
    SILEQ: {
        code: "SILEQ",
        name: "Mirror Judge",
        nameJp: "鏡の裁定者",
        lens: "内面の論理的正しさを追求する孤高の批評家。",
        keywords: ["Objectivity", "Self-Correction", "Aesthetics"],
        action_style: "Self-Correct (自分を正す)"
    },
    SILD: {
        code: "SILD",
        name: "Archive Keeper",
        nameJp: "記録の番人",
        lens: "知識や経験を蓄積し、体系化して守る賢者。",
        keywords: ["Knowledge", "Tradition", "Archive"],
        action_style: "Refer (先例に学ぶ)"
    },

    // Ward (S) + Terra (C) combinations
    SCEQ: {
        code: "SCEQ",
        name: "Earth Tender",
        nameJp: "大地の守り手",
        lens: "身近な人や環境を慈しみ守るケアギバー。",
        keywords: ["Care", "Protection", "Empathy"],
        action_style: "Nurture (育てる/守る)"
    },
    SCED: {
        code: "SCED",
        name: "Root Guardian",
        nameJp: "根源の守護者",
        lens: "伝統や共同体を守り抜く決意を持つ守護神。",
        keywords: ["Responsibility", "Defense", "Community"],
        action_style: "Fortify (守りを固める)"
    },
    SCLEQ: {
        code: "SCLEQ",
        name: "Balance Smith",
        nameJp: "均衡の鍛冶",
        lens: "関係性の中での公平さやバランスを論理的に調整する。",
        keywords: ["Balance", "Fairness", "Adjustment"],
        action_style: "Balance (調整する)"
    },
    SCLD: {
        code: "SCLD",
        name: "Foundation Master",
        nameJp: "基盤の達人",
        lens: "現実的な生活基盤を論理的に固める実務家。",
        keywords: ["Foundation", "Risk-Management", "Practicality"],
        action_style: "Stabilize (基盤を固める)"
    }
};

// タイプコードからタイプ情報を取得
export function getSigilType(code: string): SigilType | undefined {
    return SIGIL_TYPES[code];
}

// タイプ名を取得（日本語）
export function getTypeName(code: string): string {
    const type = SIGIL_TYPES[code];
    return type ? type.nameJp : "探求者";
}

// TYPE_LENS を取得
export function getTypeLens(code: string): string {
    const type = SIGIL_TYPES[code];
    if (!type) {
        return "直感を信じ、カードの示す方向へ一歩踏み出してください。";
    }
    return type.lens;
}

// 軸の優位性を判定
export function getAxisDominance(code: string): {
    arcanaFocus: 'aether' | 'terra';  // I/C
    emotionFocus: 'chalice' | 'blade'; // E/L
    actionFocus: 'spark' | 'rune';     // Q/D
} {
    const ic = code.charAt(1);
    const el = code.charAt(2);
    const qd = code.charAt(3);

    return {
        arcanaFocus: ic === 'I' ? 'aether' : 'terra',
        emotionFocus: el === 'E' ? 'chalice' : 'blade',
        actionFocus: qd === 'Q' ? 'spark' : 'rune'
    };
}
