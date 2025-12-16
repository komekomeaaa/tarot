// 16シジル診断 質問データ（20問）
// 4軸: V/S (Catalyst/Ward), I/C (Aether/Terra), E/L (Chalice/Blade), Q/D (Spark/Rune)

export interface Question {
    id: number;
    text: string;
    optionA: { text: string; axis: string };
    optionB: { text: string; axis: string };
}

export const QUESTIONS: Question[] = [
    // V/S 軸 (5問)
    {
        id: 1,
        text: '新しいことに挑戦するとき、あなたは…',
        optionA: { text: 'すぐに動き出したい', axis: 'V' },
        optionB: { text: 'まず状況を見極めたい', axis: 'S' }
    },
    {
        id: 2,
        text: '困っている人を見かけたとき…',
        optionA: { text: '声をかけて助けたい', axis: 'V' },
        optionB: { text: '見守りながらサポートしたい', axis: 'S' }
    },
    {
        id: 3,
        text: '変化が訪れたとき…',
        optionA: { text: '新しい流れを活かしたい', axis: 'V' },
        optionB: { text: '安定を守りながら対応したい', axis: 'S' }
    },
    {
        id: 4,
        text: 'チームや集まりでは…',
        optionA: { text: '積極的に発言する方だ', axis: 'V' },
        optionB: { text: '聞き役に回ることが多い', axis: 'S' }
    },
    {
        id: 5,
        text: '物事を進めるとき…',
        optionA: { text: '自分から仕掛けていく', axis: 'V' },
        optionB: { text: 'タイミングを待つ', axis: 'S' }
    },

    // I/C 軸 (5問)
    {
        id: 6,
        text: '問題を解決するとき、まず…',
        optionA: { text: '全体像を把握したい', axis: 'I' },
        optionB: { text: '具体的な手順を確認したい', axis: 'C' }
    },
    {
        id: 7,
        text: 'アイデアが浮かぶのは…',
        optionA: { text: '抽象的なイメージから', axis: 'I' },
        optionB: { text: '具体的な経験から', axis: 'C' }
    },
    {
        id: 8,
        text: '説明するときは…',
        optionA: { text: '例え話や比喩を使う', axis: 'I' },
        optionB: { text: '事実や手順を順番に話す', axis: 'C' }
    },
    {
        id: 9,
        text: '計画を立てるとき…',
        optionA: { text: 'ゴールから逆算する', axis: 'I' },
        optionB: { text: '今からできることを積み上げる', axis: 'C' }
    },
    {
        id: 10,
        text: '迷ったときに頼りにするのは…',
        optionA: { text: '直感やひらめき', axis: 'I' },
        optionB: { text: '過去の経験や事例', axis: 'C' }
    },

    // E/L 軸 (5問)
    {
        id: 11,
        text: '選択するときに大切なのは…',
        optionA: { text: '心が動くかどうか', axis: 'E' },
        optionB: { text: '論理的に正しいかどうか', axis: 'L' }
    },
    {
        id: 12,
        text: '人間関係で重視するのは…',
        optionA: { text: '共感と調和', axis: 'E' },
        optionB: { text: '誠実さと公平さ', axis: 'L' }
    },
    {
        id: 13,
        text: '議論になったとき…',
        optionA: { text: '相手の気持ちを考える', axis: 'E' },
        optionB: { text: '論点を整理したい', axis: 'L' }
    },
    {
        id: 14,
        text: '決断するときは…',
        optionA: { text: '温かい選択をしたい', axis: 'E' },
        optionB: { text: '合理的な選択をしたい', axis: 'L' }
    },
    {
        id: 15,
        text: 'フィードバックをするとき…',
        optionA: { text: '相手の気持ちに配慮する', axis: 'E' },
        optionB: { text: '事実をはっきり伝える', axis: 'L' }
    },

    // Q/D 軸 (5問)
    {
        id: 16,
        text: '新しい情報を得たとき…',
        optionA: { text: 'すぐに試したい', axis: 'Q' },
        optionB: { text: 'じっくり吟味したい', axis: 'D' }
    },
    {
        id: 17,
        text: '判断を下すときは…',
        optionA: { text: '早く決めて動きたい', axis: 'Q' },
        optionB: { text: '時間をかけて見極めたい', axis: 'D' }
    },
    {
        id: 18,
        text: '予定を立てるとき…',
        optionA: { text: '柔軟に変えられる方がいい', axis: 'Q' },
        optionB: { text: 'しっかり決めておきたい', axis: 'D' }
    },
    {
        id: 19,
        text: 'タスクの進め方は…',
        optionA: { text: '並行して複数進める', axis: 'Q' },
        optionB: { text: '一つずつ完了させる', axis: 'D' }
    },
    {
        id: 20,
        text: '答えを出すときに好むのは…',
        optionA: { text: 'スピード感のある決断', axis: 'Q' },
        optionB: { text: '熟考した結論', axis: 'D' }
    }
];
