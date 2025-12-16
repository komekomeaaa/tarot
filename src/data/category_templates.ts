// カテゴリ別テンプレート
// 仕様書: 恋愛/仕事/お金/健康/人間関係/家族

export type CategoryType = 'love' | 'work' | 'money' | 'health' | 'relationship' | 'family';
export type DeadlineType = 'today' | 'week' | 'month' | '3months';

// カテゴリ別THEME_LINE生成テンプレート
export interface CategoryTemplate {
    thesisTemplate: string;
    situationTemplate: string;
    obstacleTemplate: string;
    adviceTemplate: string;
    keyLine: string; // カテゴリ別の最後の一文
    messageTemplate?: string; // 任意：連絡/メッセージテンプレ
}

export const CATEGORY_TEMPLATES: Record<CategoryType, CategoryTemplate> = {
    love: {
        thesisTemplate: `今は「{DOMINANT_SUIT}」の領域が強く出ています。焦点は、{ADVICE_KW}の方向へ舵を切ること。
あなたが望む「{USER_GOAL}」は、急ぐほど歪むので、まずは"軽い一手"で流れを整えるのが得策です。`,
        situationTemplate: `現状は{SITUATION_CARD}が示す通り、関係は「{SITUATION_KW}」の段階。動く余地はあるが、言葉の重さで結果が変わります。`,
        obstacleTemplate: `障害は{OBSTACLE_CARD}。{OBSTACLE_ORI}の影響で「{OBSTACLE_KW}」が出やすい。ここで感情の確認を急ぐと、相手に負担として伝わります。`,
        adviceTemplate: `助言は{ADVICE_CARD}。最優先は、相手の負担を最小にした"接点づくり"。
結論を取りに行くより、反応が返りやすい形で一段だけ進めるのが良い流れです。`,
        keyLine: `鍵は"重い確認"ではなく"反応が返りやすい接点"を作ることです。`,
        messageTemplate: `（送信文例）
「短く聞きたいんだけど、今週どこかで少しだけ話せる時間ある？無理なら大丈夫！」`
    },
    work: {
        thesisTemplate: `今回の焦点は「判断の軸」と「実務の手順」です。{ADVICE_KW}が鍵。
勝ち筋は、結論を先に置き、条件（期限・優先順位）を揃えて動くことにあります。`,
        situationTemplate: `{SITUATION_CARD}が示す現状は「{SITUATION_KW}」。タスク/期待値/責任のどれかが膨らみやすい配置です。`,
        obstacleTemplate: `{OBSTACLE_CARD}が障害。{OBSTACLE_ORI}により「{OBSTACLE_KW}」が起点で詰まりやすい。
論点が混ざるほど、摩擦（対人/評価/品質）が増えます。`,
        adviceTemplate: `{ADVICE_CARD}の導きは「{ADVICE_KW}」。
やるべきは"説明"ではなく"合意"。条件を1つに絞り、次の確認点までセットで提示してください。`,
        keyLine: `鍵は"説明"より"合意"。優先順位と期限を一つに絞って提示してください。`,
        messageTemplate: `（送信文例）
「結論から共有します。{USER_GOAL}のために、今週はAを優先したいです。期限は◯日です。問題なければこの方針で進めます。」`
    },
    money: {
        thesisTemplate: `お金の占いは"予言"ではなく"整え方"です。焦点は{ADVICE_KW}。
今は「現実（Pentacles）」が出やすい局面なので、数字を小さく見える化すると不安が落ちます。`,
        situationTemplate: `{SITUATION_CARD}は「{SITUATION_KW}」を示しています。収入よりも、支出/固定費/習慣のいずれかがボトルネックになりやすいです。`,
        obstacleTemplate: `{OBSTACLE_CARD}の影は「{OBSTACLE_KW}」。{OBSTACLE_ORI}だと、焦りや衝動で判断がブレやすい。
"増やす"より先に、"漏れ"を塞ぐのが先です。`,
        adviceTemplate: `{ADVICE_CARD}が示す導きは「{ADVICE_KW}」。
今日やるべきは、1つの数字（固定費/返済/積立など）に的を絞り、次の一手を決めることです。`,
        keyLine: `鍵は予言ではなく整え方。数字を小さく見える化し、漏れを塞ぐ順番を決めてください。`
    },
    health: {
        thesisTemplate: `健康は"診断"ではなく"傾向の読み"です。焦点は{ADVICE_KW}。
今回の配置は、回復の優先順位（睡眠/食事/休息/負荷）を整えるほど運が上向く型です。`,
        situationTemplate: `{SITUATION_CARD}は「{SITUATION_KW}」。体調・気分の波が出やすく、原因が一つに見えない局面です。`,
        obstacleTemplate: `{OBSTACLE_CARD}の影は「{OBSTACLE_KW}」。{OBSTACLE_ORI}のときは、無理の積み重ねや不安の増幅が起きやすい。
"頑張る"より"整える"が正解です。`,
        adviceTemplate: `{ADVICE_CARD}の導きは「{ADVICE_KW}」。
今日は症状や生活の時系列を整え、必要なら相談（医療/専門窓口）へ繋ぐ準備をしてください。`,
        keyLine: `鍵は診断ではなく整え方。症状・生活の時系列を作り、必要なら相談に繋ぐ準備をしてください。`
    },
    relationship: {
        thesisTemplate: `今回の核心は「距離」と「言葉の設計」です。鍵は{ADVICE_KW}。
関係を壊さずに進めるには、境界線を"短い言葉"で提示するのが最短です。`,
        situationTemplate: `{SITUATION_CARD}は「{SITUATION_KW}」。あなたが抱え込みやすい配置なので、役割や期待値が曖昧になっています。`,
        obstacleTemplate: `{OBSTACLE_CARD}の影は「{OBSTACLE_KW}」。{OBSTACLE_ORI}だと、誤解・遠慮・先回りが増えて消耗します。`,
        adviceTemplate: `{ADVICE_CARD}の導きは「{ADVICE_KW}」。
"説明"より"合意"。相手に要求を増やさず、あなたのルールを1つだけ置いてください。`,
        keyLine: `鍵は"説明"より"合意"。相手に要求を増やさず、あなたのルールを1つだけ置いてください。`,
        messageTemplate: `（送信文例）
「今回は難しいです。代わりに◯◯ならできます／または来週なら調整できます。」`
    },
    family: {
        thesisTemplate: `家族の占いは"正しさ"より"続く形"が答えです。鍵は{ADVICE_KW}。
短期で決着を狙わず、生活に落ちるルール（時間・分担・合意）を作るほど運が安定します。`,
        situationTemplate: `{SITUATION_CARD}は「{SITUATION_KW}」。感情の波と生活条件が絡みやすいので、会話が噛み合いにくい配置です。`,
        obstacleTemplate: `{OBSTACLE_CARD}の影は「{OBSTACLE_KW}」。{OBSTACLE_ORI}では、我慢や先延ばしが積もって爆発しやすい。`,
        adviceTemplate: `{ADVICE_CARD}の導きは「{ADVICE_KW}」。
最初に"決めること"を1つに絞り、次回の話し合い日時までセットで置くのが良い流れです。`,
        keyLine: `鍵は"正しさ"より"続く形"。生活に落ちるルールを1つ作ることから始めてください。`
    }
};

// 期限別 SIGN_LINE
export const SIGN_LINES: Record<DeadlineType, string> = {
    today: `今日中に「気持ちが落ち着く／判断が軽くなる」感覚が出るかを確認。`,
    week: `1週間以内に「相手の反応／作業の進み／不安の強さ」が改善する兆しが出るかを観察。`,
    month: `1か月以内に「状況が繰り返されない仕組み」ができたかを確認。`,
    '3months': `3か月で「習慣・環境・関係の型」が定着したかを確認。`
};

// SAFETY_LINE 条件と文面
export const SAFETY_LINES = {
    health: `※強い不調や危険を感じる場合は、占いで判断せず、早めに医療機関や公的窓口へ相談してください。`,
    money_debt: `※借金・債務については、占いで解決を図らず、専門家（弁護士・司法書士・相談窓口）への相談を準備してください。`,
    money_invest: `※投資判断は占いで行わないでください。必ず専門家の意見と自己責任で判断してください。`,
    crisis: `※自傷や他害の兆候がある場合は、占い結果ではなく、専門の支援窓口（よりそいホットライン 0120-279-338 等）へ連絡してください。`,
    pet: `※ペットの体調は占いで判断せず、症状ログを持って獣医に相談してください。`
};

// 危険キーワード検出（簡易版）
export function detectSafetyNeeded(
    category: CategoryType,
    userInput: string
): string | null {
    const lowerInput = userInput.toLowerCase();

    // 危機兆候
    if (/死にたい|消えたい|自殺|リストカット/.test(userInput)) {
        return SAFETY_LINES.crisis;
    }

    // 健康カテゴリ
    if (category === 'health') {
        if (/病院|診断|症状|痛み|辛い/.test(userInput)) {
            return SAFETY_LINES.health;
        }
    }

    // お金カテゴリ
    if (category === 'money') {
        if (/借金|債務|返済|ローン/.test(userInput)) {
            return SAFETY_LINES.money_debt;
        }
        if (/投資|株|FX|仮想通貨|ギャンブル/.test(userInput)) {
            return SAFETY_LINES.money_invest;
        }
    }

    // 家族カテゴリ（ペット）
    if (category === 'family') {
        if (/ペット|犬|猫|動物|元気がない/.test(lowerInput)) {
            return SAFETY_LINES.pet;
        }
    }

    return null;
}

// スート名の日本語変換
export function getSuitNameJp(suit: string | null): string {
    const map: Record<string, string> = {
        wands: '意欲・推進（Wands）',
        cups: '感情・関係（Cups）',
        swords: '思考・判断（Swords）',
        pentacles: '現実・継続（Pentacles）'
    };
    return suit ? map[suit] || suit : '全体';
}
