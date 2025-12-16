// 16シジルタイプ定義
// 4軸: V/S (Catalyst/Ward), I/C (Aether/Terra), E/L (Chalice/Blade), Q/D (Spark/Rune)

export interface SigilType {
    code: string;      // e.g., "VIEQ"
    name: string;      // e.g., "Astra Seer"
    nameJp: string;    // e.g., "星読みの探求者"
    lens: string;      // TYPE_LENS用の1行補足
}

// 16タイプ定義
export const SIGIL_TYPES: Record<string, SigilType> = {
    // Catalyst (V) + Aether (I) combinations
    VIEQ: {
        code: "VIEQ",
        name: "Astra Seer",
        nameJp: "星読みの探求者",
        lens: "象徴（大アルカナ）を先に掴み、今日の一手を短く強く決めると精度が上がります。"
    },
    VIED: {
        code: "VIED",
        name: "Oracle Keeper",
        nameJp: "神託の守護者",
        lens: "象徴から全体像を掴み、確認ポイントを丁寧に設定すると読みが安定します。"
    },
    VILEQ: {
        code: "VILEQ",
        name: "Flame Philosopher",
        nameJp: "炎の哲学者",
        lens: "象徴と論点を結び、今日の一手を短く強く決めると流れが作れます。"
    },
    VILD: {
        code: "VILD",
        name: "Truth Weaver",
        nameJp: "真実の織り手",
        lens: "象徴から論点を抽出し、確認ポイントを丁寧に設定すると精度が高まります。"
    },

    // Catalyst (V) + Terra (C) combinations
    VCEQ: {
        code: "VCEQ",
        name: "Path Forger",
        nameJp: "道を拓く者",
        lens: "手順（小アルカナ）を重視し、今日の一手を短く強く決めると突破口が開けます。"
    },
    VCED: {
        code: "VCED",
        name: "Stone Crafter",
        nameJp: "石の職人",
        lens: "手順を丁寧に追い、確認ポイントを明確にすると着実に進みます。"
    },
    VCLEQ: {
        code: "VCLEQ",
        name: "Steel Strategist",
        nameJp: "鋼の戦略家",
        lens: "手順と論点を結び、今日の一手を短く強く決めると効率が上がります。"
    },
    VCLD: {
        code: "VCLD",
        name: "Structure Sage",
        nameJp: "構造の賢者",
        lens: "手順と論理から確認ポイントを設定すると、ブレない判断ができます。"
    },

    // Ward (S) + Aether (I) combinations
    SIEQ: {
        code: "SIEQ",
        name: "Dream Walker",
        nameJp: "夢を歩く者",
        lens: "象徴（大アルカナ）の感情面を重視し、今日の一手を短くまとめると動きやすくなります。"
    },
    SIED: {
        code: "SIED",
        name: "Still Water",
        nameJp: "静かなる水面",
        lens: "象徴から感情の流れを読み、確認ポイントを丁寧に観察すると精度が上がります。"
    },
    SILEQ: {
        code: "SILEQ",
        name: "Mirror Judge",
        nameJp: "鏡の裁定者",
        lens: "象徴と論点のバランスを取り、今日の一手を短く決めると迷いが減ります。"
    },
    SILD: {
        code: "SILD",
        name: "Archive Keeper",
        nameJp: "記録の番人",
        lens: "象徴から論点を整理し、確認ポイントを時系列で追うと読みが深まります。"
    },

    // Ward (S) + Terra (C) combinations
    SCEQ: {
        code: "SCEQ",
        name: "Earth Tender",
        nameJp: "大地の守り手",
        lens: "手順（小アルカナ）と感情を結び、今日の一手を短くまとめると進みやすくなります。"
    },
    SCED: {
        code: "SCED",
        name: "Root Guardian",
        nameJp: "根源の守護者",
        lens: "手順を丁寧に追いながら、確認ポイントで感情の変化を観察すると安定します。"
    },
    SCLEQ: {
        code: "SCLEQ",
        name: "Balance Smith",
        nameJp: "均衡の鍛冶",
        lens: "手順と論点を結び、今日の一手を短く決めると効率よく進みます。"
    },
    SCLD: {
        code: "SCLD",
        name: "Foundation Master",
        nameJp: "基盤の達人",
        lens: "手順と論理から確認ポイントを設定し、丁寧に進めると着実な結果が出ます。"
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
