// noteリンク設定
// シジルタイプ、カード、スプレッド別のnote記事URLを管理

export interface NoteLinks {
    // シジルタイプ別（16記事）
    sigilTypes: Record<string, string>;

    // カード別（78記事）
    cards: Record<string, string>;

    // スプレッド別
    spreads: Record<string, string>;

    // その他
    general: string;  // 総合案内
    about: string;    // シジルタロットとは
}

/**
 * noteリンク設定
 * 各記事を作成したら、対応するURLを更新してください
 */
export const noteLinks: NoteLinks = {
    // シジルタイプ別解説（16記事）
    sigilTypes: {
        VIEQ: '',      // 星読みの探求者
        VIED: '',      // 神託の守護者
        VILEQ: '',     // 炎の哲学者
        VILD: '',      // 真実の織り手
        VCEQ: '',      // 道を拓く者
        VCED: '',      // 石の職人
        VCLEQ: '',     // 鋼の戦略家
        VCLD: '',      // 構造の賢者
        SIEQ: '',      // 夢を歩く者
        SIED: '',      // 静かなる水面
        SILEQ: '',     // 鏡の裁定者
        SILD: '',      // 記録の番人
        SCEQ: '',      // 大地の守り手
        SCED: '',      // 根源の守護者
        SCLEQ: '',     // 均衡の鍛冶
        SCLD: '',      // 基盤の達人
    },

    // カード別完全解説（78記事）
    cards: {
        // 大アルカナ（22枚）
        'the-fool': '',
        'the-magician': '',
        'the-high-priestess': '',
        'the-empress': '',
        'the-emperor': '',
        'the-hierophant': '',
        'the-lovers': '',
        'the-chariot': '',
        'strength': '',
        'the-hermit': '',
        'wheel-of-fortune': '',
        'justice': '',
        'the-hanged-man': '',
        'death': '',
        'temperance': '',
        'the-devil': '',
        'the-tower': '',
        'the-star': '',
        'the-moon': '',
        'the-sun': '',
        'judgement': '',
        'the-world': '',

        // ワンド（14枚）
        'ace-of-wands': '', 'two-of-wands': '', 'three-of-wands': '', 'four-of-wands': '',
        'five-of-wands': '', 'six-of-wands': '', 'seven-of-wands': '', 'eight-of-wands': '',
        'nine-of-wands': '', 'ten-of-wands': '', 'page-of-wands': '', 'knight-of-wands': '',
        'queen-of-wands': '', 'king-of-wands': '',

        // カップ（14枚）
        'ace-of-cups': '', 'two-of-cups': '', 'three-of-cups': '', 'four-of-cups': '',
        'five-of-cups': '', 'six-of-cups': '', 'seven-of-cups': '', 'eight-of-cups': '',
        'nine-of-cups': '', 'ten-of-cups': '', 'page-of-cups': '', 'knight-of-cups': '',
        'queen-of-cups': '', 'king-of-cups': '',

        // ソード（14枚）
        'ace-of-swords': '', 'two-of-swords': '', 'three-of-swords': '', 'four-of-swords': '',
        'five-of-swords': '', 'six-of-swords': '', 'seven-of-swords': '', 'eight-of-swords': '',
        'nine-of-swords': '', 'ten-of-swords': '', 'page-of-swords': '', 'knight-of-swords': '',
        'queen-of-swords': '', 'king-of-swords': '',

        // ペンタクル（14枚）
        'ace-of-pentacles': '', 'two-of-pentacles': '', 'three-of-pentacles': '', 'four-of-pentacles': '',
        'five-of-pentacles': '', 'six-of-pentacles': '', 'seven-of-pentacles': '', 'eight-of-pentacles': '',
        'nine-of-pentacles': '', 'ten-of-pentacles': '', 'page-of-pentacles': '', 'knight-of-pentacles': '',
        'queen-of-pentacles': '', 'king-of-pentacles': '',
    },

    // スプレッド別ガイド
    spreads: {
        'one_card': '',       // ワンカード完全ガイド
        'three_card': '',     // スリーカード完全ガイド
        'celtic_cross': '',   // ケルト十字完全ガイド
    },

    // その他
    general: '',  // シジルタロット総合案内（マガジン）
    about: '',    // シジルタロットとは
};

/**
 * URLが設定されているかチェック
 */
export function hasNoteLink(type: 'sigil' | 'card' | 'spread', id: string): boolean {
    switch (type) {
        case 'sigil':
            return !!noteLinks.sigilTypes[id];
        case 'card':
            return !!noteLinks.cards[id];
        case 'spread':
            return !!noteLinks.spreads[id];
        default:
            return false;
    }
}

/**
 * note URLを取得
 */
export function getNoteLink(type: 'sigil' | 'card' | 'spread', id: string): string | null {
    switch (type) {
        case 'sigil':
            return noteLinks.sigilTypes[id] || null;
        case 'card':
            return noteLinks.cards[id] || null;
        case 'spread':
            return noteLinks.spreads[id] || null;
        default:
            return null;
    }
}
