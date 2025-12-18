// 解釈エンジン
// 組み合わせ補正ロジック + 結果生成

import type { DrawnCard, CardDefinition, UserContext, SpreadType } from '../types';
import { CARDS } from '../data/cards';
import { POSITION_TEMPLATES, CARD_MODIFIERS } from '../data/templates';
import {
    calculateSigilSuitSynergy,
    adjustByReversedRatio,
    formatSynergyMessage
} from './synergy';
import {
    getCategorySigilCardTemplate
} from '../data/structured-templates';
import {
    CATEGORY_TEMPLATES,
    SIGN_LINES,
    detectSafetyNeeded,
    getSuitNameJp,
    type CategoryType,
    type DeadlineType
} from '../data/category_templates';
import { selectRitual } from '../data/rituals';
import { getTypeLens, getAxisDominance } from '../data/sigil_types';

// 解析結果
export interface ReadingAnalysis {
    dominantArcana: 'major' | 'minor' | 'mixed';
    dominantSuit: 'wands' | 'cups' | 'swords' | 'pentacles' | null;
    reversedRatio: number;
    hasCourtCards: boolean;
    majorCount: number;
    suitCounts: Record<string, number>;
}

// 生成された結果
export interface GeneratedReading {
    summary: string;           // THESIS_LINE相当
    positionReadings: Array<{
        positionId: string;
        text: string;
    }>;
    overallAdvice: string;     // ADVICE_LINE強調版
    actionRitual: string;      // ACTION_RITUAL
    signLine: string;          // SIGN_LINE
    safetyLine?: string;       // SAFETY_LINE（必要時のみ）
    typeLens: string;          // TYPE_LENS
    synergyInsight?: string;   // Phase 2: シジル×スート相互作用
}

// カードIDからカード定義を取得
function getCard(cardId: string): CardDefinition | undefined {
    return CARDS.find(c => c.id === cardId);
}

// キーワードを取得
function getKeywords(cardId: string, orientation: 'upright' | 'reversed'): string {
    const card = getCard(cardId);
    if (!card) return '';
    const kws = orientation === 'upright' ? card.keywords_upright : card.keywords_reversed;
    return kws.slice(0, 2).join('/');
}

// スプレッドを解析（組み合わせ補正）
export function analyzeSpread(cards: DrawnCard[]): ReadingAnalysis {
    let majorCount = 0;
    let minorCount = 0;
    let reversedCount = 0;
    let hasCourtCards = false;
    const suitCounts: Record<string, number> = {
        wands: 0,
        cups: 0,
        swords: 0,
        pentacles: 0
    };

    for (const drawn of cards) {
        const card = getCard(drawn.cardId);
        if (!card) continue;

        // 大アルカナ/小アルカナカウント
        if (card.arcana === 'major') {
            majorCount++;
        } else {
            minorCount++;
            // スートカウント
            if (card.suit) {
                suitCounts[card.suit]++;
            }
            // 人物札チェック
            if (typeof card.rank === 'string') {
                hasCourtCards = true;
            }
        }

        // 逆位置カウント
        if (drawn.orientation === 'reversed') {
            reversedCount++;
        }
    }

    // 大アルカナ優位判定
    let dominantArcana: 'major' | 'minor' | 'mixed' = 'mixed';
    if (majorCount > minorCount) {
        dominantArcana = 'major';
    } else if (minorCount > majorCount) {
        dominantArcana = 'minor';
    }

    // スート偏り判定
    let dominantSuit: 'wands' | 'cups' | 'swords' | 'pentacles' | null = null;
    let maxSuitCount = 0;
    for (const [suit, count] of Object.entries(suitCounts)) {
        if (count > maxSuitCount) {
            maxSuitCount = count;
            dominantSuit = suit as 'wands' | 'cups' | 'swords' | 'pentacles';
        }
    }
    // 2枚以上でないと偏りとしない
    if (maxSuitCount < 2) {
        dominantSuit = null;
    }

    // 逆位置比率
    const reversedRatio = cards.length > 0 ? reversedCount / cards.length : 0;

    return {
        dominantArcana,
        dominantSuit,
        reversedRatio,
        hasCourtCards,
        majorCount,
        suitCounts
    };
}

// 位置別の解釈文を生成（属性補正文付き）
export function generatePositionLine(
    positionId: string,
    cardId: string,
    orientation: 'upright' | 'reversed'
): string {
    const card = getCard(cardId);
    if (!card) return '';

    const template = POSITION_TEMPLATES[positionId];
    if (!template) return '';

    const templateText = orientation === 'upright' ? template.upright : template.reversed;
    const keywords = getKeywords(cardId, orientation);

    // 基本テンプレートを生成
    let line = templateText
        .replace(/{CARD}/g, card.name)
        .replace(/{KW}/g, keywords);

    // 属性補正文を追加（最大2つまで）
    const modifiers: string[] = [];

    // 1. 大アルカナ/スート補正
    if (card.arcana === 'major') {
        const majorMod = CARD_MODIFIERS.major[orientation];
        if (majorMod) modifiers.push(majorMod);
    } else if (card.suit) {
        const suitMod = CARD_MODIFIERS.suits[card.suit as keyof typeof CARD_MODIFIERS.suits];
        if (suitMod) modifiers.push(suitMod);
    }

    // 2. 人物札補正（最大2つまでなので条件付き）
    if (typeof card.rank === 'string' && modifiers.length < 2) {
        const courtMod = CARD_MODIFIERS.court[card.rank as keyof typeof CARD_MODIFIERS.court];
        if (courtMod) modifiers.push(courtMod);
    }

    // 3. 数札補正（人物札がない場合のみ）
    if (typeof card.rank === 'number' && modifiers.length < 2) {
        let numberMod: string | undefined;
        if (card.rank === 1) {
            numberMod = CARD_MODIFIERS.number.ace;
        } else if (card.rank <= 3) {
            numberMod = CARD_MODIFIERS.number.small;
        } else if (card.rank <= 6) {
            numberMod = CARD_MODIFIERS.number.middle;
        } else if (card.rank <= 8) {
            numberMod = CARD_MODIFIERS.number.late;
        } else {
            numberMod = CARD_MODIFIERS.number.end;
        }
        if (numberMod) modifiers.push(numberMod);
    }

    // 補正文を追加
    if (modifiers.length > 0) {
        line += ' ' + modifiers.join(' ');
    }

    return line;
}

// カテゴリ別のTHESIS_LINEを生成
export function generateThesisLine(
    category: CategoryType,
    analysis: ReadingAnalysis,
    cards: DrawnCard[],
    userGoal: string
): string {
    const catTemplate = CATEGORY_TEMPLATES[category];
    if (!catTemplate) return '';

    // 各位置のカード情報を取得
    // adviceCardのみ使用（状況・障害カードは将来のテンプレート拡張用）
    const adviceCard = cards.find(c => c.positionId === 'advice' || c.positionId === 'outcome' || c.positionId === 'theme');

    let thesis = catTemplate.thesisTemplate;

    // 変数置換
    thesis = thesis.replace(/{DOMINANT_SUIT}/g, getSuitNameJp(analysis.dominantSuit));
    thesis = thesis.replace(/{USER_GOAL}/g, userGoal);

    if (adviceCard) {
        const adviceKw = getKeywords(adviceCard.cardId, adviceCard.orientation);
        thesis = thesis.replace(/{ADVICE_KW}/g, adviceKw);
    }

    // 逆位置が多い場合の調整
    if (analysis.reversedRatio >= 0.6) {
        thesis += `\n\n逆位置が多く、外に押すより内側の調整が先です。鍵は"やることを増やさず、整える順番を決めること"です。`;
    }

    return thesis;
}

// 3枚スプレッド用の詳細生成（エクスポートして将来の拡張に備える）
export function generateThreeCardDetails(
    category: CategoryType,
    cards: DrawnCard[]
): { situationLine: string; obstacleLine: string; adviceLine: string } {
    const catTemplate = CATEGORY_TEMPLATES[category];

    const situationCard = cards.find(c => c.positionId === 'situation');
    const obstacleCard = cards.find(c => c.positionId === 'obstacle');
    const adviceCard = cards.find(c => c.positionId === 'advice');

    let situationLine = '';
    let obstacleLine = '';
    let adviceLine = '';

    if (situationCard && catTemplate) {
        const card = getCard(situationCard.cardId);
        situationLine = catTemplate.situationTemplate
            .replace(/{SITUATION_CARD}/g, card?.name || '')
            .replace(/{SITUATION_KW}/g, getKeywords(situationCard.cardId, situationCard.orientation));
    }

    if (obstacleCard && catTemplate) {
        const card = getCard(obstacleCard.cardId);
        const oriText = obstacleCard.orientation === 'upright' ? '正位置' : '逆位置';
        obstacleLine = catTemplate.obstacleTemplate
            .replace(/{OBSTACLE_CARD}/g, card?.name || '')
            .replace(/{OBSTACLE_KW}/g, getKeywords(obstacleCard.cardId, obstacleCard.orientation))
            .replace(/{OBSTACLE_ORI}/g, oriText);
    }

    if (adviceCard && catTemplate) {
        const card = getCard(adviceCard.cardId);
        adviceLine = catTemplate.adviceTemplate
            .replace(/{ADVICE_CARD}/g, card?.name || '')
            .replace(/{ADVICE_KW}/g, getKeywords(adviceCard.cardId, adviceCard.orientation));
    }

    return { situationLine, obstacleLine, adviceLine };
}

// 全体の結果生成
export function generateReading(
    spreadId: SpreadType,
    cards: DrawnCard[],
    userContext: UserContext
): GeneratedReading {
    const analysis = analyzeSpread(cards);
    const category = userContext.category as CategoryType;
    const deadline = userContext.deadline as DeadlineType;
    const sigilType = userContext.sigilType || 'VIEQ';

    // 各位置の解釈文
    const positionReadings = cards.map(drawn => ({
        positionId: drawn.positionId,
        text: generatePositionLine(drawn.positionId, drawn.cardId, drawn.orientation)
    }));

    // THESIS_LINE
    let summary = generateThesisLine(category, analysis, cards, userContext.goal);

    // 3枚の場合は詳細も生成（将来的にpositionReadingsに統合可能）
    if (spreadId === 'three_card') {
        // generateThreeCardDetails(category, cards) で詳細生成可能
        // 現在は positionReadings で対応
    }

    // 大アルカナ優先の強調
    if (analysis.dominantArcana === 'major') {
        summary = `【人生テーマとして読む】\n${summary}`;
    }

    // OVERALL ADVICE（カテゴリ別のkey_line）
    const catTemplate = CATEGORY_TEMPLATES[category];
    const overallAdvice = catTemplate?.keyLine || '';

    // ACTION_RITUAL
    const actionRitual = selectRitual(analysis.dominantSuit, category, analysis.reversedRatio);

    // SIGN_LINE
    const signLine = SIGN_LINES[deadline] || SIGN_LINES.week;

    // SAFETY_LINE
    const safetyLine = detectSafetyNeeded(category, userContext.situation + ' ' + userContext.goal) || undefined;

    // TYPE_LENS
    const axisDominance = getAxisDominance(sigilType);
    let typeLens = getTypeLens(sigilType);

    // タイプに応じて強調を調整
    if (axisDominance.arcanaFocus === 'aether' && analysis.dominantArcana === 'major') {
        typeLens = `あなたのシジルは大アルカナとの相性が良く、象徴から全体像を掴みやすい配置です。${typeLens}`;
    }

    // Phase 2: シジル×スート相互作用の計算
    let synergyInsight: string | undefined;

    // シジル×スート偏りの相互作用
    const suitSynergy = calculateSigilSuitSynergy(sigilType, analysis.suitCounts);
    if (suitSynergy) {
        synergyInsight = formatSynergyMessage(suitSynergy);
    }

    // 逆位置比率による調整
    const reversedAdjustment = adjustByReversedRatio(sigilType, analysis.reversedRatio);
    if (reversedAdjustment) {
        synergyInsight = synergyInsight
            ? `${synergyInsight}\n\n${reversedAdjustment}`
            : reversedAdjustment;
    }

    // Phase 3: カテゴリ × シジル × タロット 三位一体（ホットパス）
    // 恋愛カテゴリでスート偏りがある場合、専用テンプレートを適用
    if (category === 'love' && analysis.dominantSuit && sigilType) {
        const sigilChar = sigilType[0];
        const categoryTemplate = getCategorySigilCardTemplate(category, sigilChar, analysis.dominantSuit);

        if (categoryTemplate) {
            // 助言を専用テンプレートで上書き
            if (categoryTemplate.advice && categoryTemplate.strength >= 0.8) {
                // strengthが高い場合のみ適用
                if (synergyInsight) {
                    synergyInsight += `\n\n【恋愛特化アドバイス】\n${categoryTemplate.advice}`;
                } else {
                    synergyInsight = `【恋愛特化アドバイス】\n${categoryTemplate.advice}`;
                }
            }

            // リチュアルも専用テンプレートで上書き可能
            // （ただし既存のselectRitualも良質なので、両方表示も検討）
            // actionRitual = categoryTemplate.ritual;
        }
    }

    return {
        summary,
        positionReadings,
        overallAdvice,
        actionRitual,
        signLine,
        safetyLine,
        typeLens,
        synergyInsight
    };
}

// ケルト十字用の拡張結果
export interface CelticCrossReading extends GeneratedReading {
    flowLine: string;       // DYNAMIC_LINE（流れ）
    conflictLine: string;   // KEY_CONFLICT_LINE（対立点）
    leverLine: string;      // LEVER_LINE（テコ）
}

// ケルト十字専用生成
export function generateCelticCrossReading(
    cards: DrawnCard[],
    userContext: UserContext
): CelticCrossReading {
    const baseReading = generateReading('celtic_cross', cards, userContext);
    // analysisは将来の拡張用に保持
    const _analysis = analyzeSpread(cards);
    void _analysis; // TSエラー回避
    const category = userContext.category as CategoryType;

    // 各位置のカード取得
    const presentCard = cards.find(c => c.positionId === 'present');
    const challengeCard = cards.find(c => c.positionId === 'challenge');
    const pastCard = cards.find(c => c.positionId === 'past');
    const nearFutureCard = cards.find(c => c.positionId === 'near_future');
    const selfCard = cards.find(c => c.positionId === 'self');
    const envCard = cards.find(c => c.positionId === 'environment');
    const outcomeCard = cards.find(c => c.positionId === 'outcome');
    const foundationCard = cards.find(c => c.positionId === 'foundation');

    // DYNAMIC_LINE（流れ要約）
    let flowLine = '';
    if (pastCard && presentCard && nearFutureCard) {
        const pastKw = getKeywords(pastCard.cardId, pastCard.orientation);
        const presentKw = getKeywords(presentCard.cardId, presentCard.orientation);
        const nearFutureKw = getKeywords(nearFutureCard.cardId, nearFutureCard.orientation);
        flowLine = `過去（${pastKw}）の流れから、現状（${presentKw}）へ移り、次は近未来（${nearFutureKw}）が来やすい。`;
    }

    // KEY_CONFLICT_LINE（対立点）
    let conflictLine = '';
    if (presentCard && challengeCard) {
        const presentKw = getKeywords(presentCard.cardId, presentCard.orientation);
        const challengeKw = getKeywords(challengeCard.cardId, challengeCard.orientation);
        if (challengeCard.orientation === 'reversed') {
            conflictLine = `ブレーキは外的要因というより、${challengeKw}の過不足（思い込み/調整不足）です。`;
        } else {
            conflictLine = `現状は${presentKw}へ進みたい一方で、障害の${challengeKw}がブレーキになっています。`;
        }
    }

    // LEVER_LINE（テコ）
    let leverLine = '';
    if (selfCard && envCard) {
        const selfKw = getKeywords(selfCard.cardId, selfCard.orientation);
        const envKw = getKeywords(envCard.cardId, envCard.orientation);
        leverLine = `テコは「自分（${selfKw}）」を「周囲（${envKw}）」に合わせて微調整すること。まずは一段だけ負荷を下げて、次の確認点を作るのが有効です。`;
    }

    // THESIS_LINE 拡張
    let extendedSummary = baseReading.summary;
    if (presentCard && challengeCard && foundationCard && outcomeCard) {
        const presentKw = getKeywords(presentCard.cardId, presentCard.orientation);
        const challengeKw = getKeywords(challengeCard.cardId, challengeCard.orientation);
        const foundationKw = getKeywords(foundationCard.cardId, foundationCard.orientation);
        const nearFutureKw = nearFutureCard ? getKeywords(nearFutureCard.cardId, nearFutureCard.orientation) : '';
        const outcomeKw = getKeywords(outcomeCard.cardId, outcomeCard.orientation);

        extendedSummary = `核心は「${presentKw}」で、そこに「${challengeKw}」の圧が重なっています。
根には「${foundationKw}」があり、${nearFutureKw}の方向へ動きやすい配置です。
このまま進むと、結果傾向は「${outcomeKw}」。`;

        // カテゴリ別の最後の一文
        const catTemplate = CATEGORY_TEMPLATES[category];
        if (catTemplate) {
            extendedSummary += `\n${catTemplate.keyLine}`;
        }
    }

    return {
        ...baseReading,
        summary: extendedSummary,
        flowLine,
        conflictLine,
        leverLine
    };
}
