import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../context/TarotContext';
import { SpreadLayout } from '../components/SpreadLayout';
import { generateReading, generateCelticCrossReading, type CelticCrossReading } from '../logic/interpretation';
import { getCardById } from '../logic/deck';
import '../styles/result.css';

// 位置名の日本語マッピング
const POSITION_NAMES_JP: Record<string, string> = {
    theme: 'テーマ',
    situation: '現状',
    obstacle: '障害',
    advice: '助言',
    present: '現在（核）',
    challenge: '障害・交差',
    foundation: '根・土台',
    past: '過去',
    conscious: '顕在意識',
    near_future: '近未来',
    self: '自分',
    environment: '周囲',
    hopes_fears: '願望・恐れ',
    outcome: '結果傾向',
};

export const ResultPage: React.FC = () => {
    const navigate = useNavigate();
    const { lastDraw, userContext, sigilCode } = useTarot();
    const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());

    // 結果生成
    const reading = useMemo(() => {
        if (!lastDraw || !userContext) return null;

        const ctx = {
            ...userContext,
            sigilCode: sigilCode || 'VIEQ'
        };

        if (lastDraw.spreadId === 'celtic_cross') {
            return generateCelticCrossReading(lastDraw.cards, ctx);
        }
        return generateReading(lastDraw.spreadId, lastDraw.cards, ctx);
    }, [lastDraw, userContext, sigilCode]);

    // 未選択の場合
    if (!lastDraw || !userContext || !reading) {
        return (
            <div className="page-container result-page">
                <div className="mystic-header">
                    <h2>✦ 神託 ✦</h2>
                </div>
                <p className="intro-text">
                    カードが引かれていません。
                </p>
                <button onClick={() => navigate('/input')} className="primary-btn mystic-btn">
                    占いを始める
                </button>
            </div>
        );
    }

    const isCelticCross = lastDraw.spreadId === 'celtic_cross';
    const celticReading = isCelticCross ? (reading as CelticCrossReading) : null;

    const togglePosition = (positionId: string) => {
        setExpandedPositions(prev => {
            const next = new Set(prev);
            if (next.has(positionId)) {
                next.delete(positionId);
            } else {
                next.add(positionId);
            }
            return next;
        });
    };

    return (
        <div className="page-container result-page">
            {/* ヘッダー */}
            <div className="mystic-header">
                <h2>✦ 神託 ✦</h2>
            </div>

            {/* スプレッド名 */}
            <div className="spread-title">
                {lastDraw.spreadId === 'one_card' && '【一枚の啓示】'}
                {lastDraw.spreadId === 'three_card' && '【三枚の啓示】'}
                {lastDraw.spreadId === 'celtic_cross' && '【十枚の啓示 ― ケルト十字】'}
            </div>

            {/* カード表示 */}
            <section className="spread-section">
                <p className="instruction">カードをクリックして開いてください</p>
                <SpreadLayout spreadId={lastDraw.spreadId} cards={lastDraw.cards} />
            </section>

            {/* 総合結論 */}
            <section className="interpretation-section">
                <div className="summary-box oracle-box">
                    <h3><span className="icon">🔮</span> The Oracle's Thesis（総合結論）</h3>
                    <p className="thesis-text">{reading.summary}</p>
                </div>

                {/* ケルト十字専用セクション */}
                {celticReading && (
                    <>
                        {celticReading.flowLine && (
                            <div className="detail-box flow-box">
                                <h3><span className="icon">🌊</span> Flow（流れ）</h3>
                                <p>{celticReading.flowLine}</p>
                            </div>
                        )}
                        {celticReading.conflictLine && (
                            <div className="detail-box conflict-box">
                                <h3><span className="icon">⚔️</span> Key Conflict（対立点）</h3>
                                <p>{celticReading.conflictLine}</p>
                            </div>
                        )}
                        {celticReading.leverLine && (
                            <div className="detail-box lever-box">
                                <h3><span className="icon">🔧</span> Leverage（テコ）</h3>
                                <p>{celticReading.leverLine}</p>
                            </div>
                        )}
                    </>
                )}

                {/* 各位置の詳細 */}
                <div className="position-details">
                    <h3><span className="icon">📜</span> Details（各カードの意味）</h3>
                    {reading.positionReadings.map(p => {
                        const positionName = POSITION_NAMES_JP[p.positionId] || p.positionId;
                        const isExpanded = expandedPositions.has(p.positionId);
                        const drawnCard = lastDraw.cards.find(c => c.positionId === p.positionId);
                        const cardDef = drawnCard ? getCardById(drawnCard.cardId) : null;

                        return (
                            <div
                                key={p.positionId}
                                className={`reading-item ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => togglePosition(p.positionId)}
                            >
                                <div className="reading-header">
                                    <h4>【{positionName}】</h4>
                                    {cardDef && (
                                        <span className="card-name">
                                            {cardDef.name} ({drawnCard?.orientation === 'upright' ? '正' : '逆'})
                                        </span>
                                    )}
                                    <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
                                </div>
                                {isExpanded && <p className="reading-text">{p.text}</p>}
                            </div>
                        );
                    })}
                </div>

                {/* 助言 */}
                {reading.overallAdvice && (
                    <div className="advice-box">
                        <h3><span className="icon">💫</span> Guidance（導き）</h3>
                        <p>{reading.overallAdvice}</p>
                    </div>
                )}

                {/* 今日の一手 */}
                <div className="ritual-box">
                    <h3><span className="icon">✨</span> Ritual（今日の一手）</h3>
                    <p>{reading.actionRitual}</p>
                </div>

                {/* 確認ポイント */}
                <div className="sign-box">
                    <h3><span className="icon">👁️</span> Sign（確認ポイント）</h3>
                    <p>{reading.signLine}</p>
                </div>

                {/* タイプ補足 */}
                <div className="type-lens-box">
                    <p className="type-lens">{reading.typeLens}</p>
                </div>

                {/* 安全注意 */}
                {reading.safetyLine && (
                    <div className="safety-box">
                        <p className="safety-line">{reading.safetyLine}</p>
                    </div>
                )}
            </section>

            {/* ナビゲーション */}
            <div className="actions">
                <button onClick={() => navigate('/select-spread')} className="secondary-btn">
                    別のスプレッドで占う
                </button>
                <button onClick={() => navigate('/input')} className="primary-btn mystic-btn">
                    新しい相談をする
                </button>
            </div>
        </div>
    );
};
