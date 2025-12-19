import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../context/TarotContext';
import { SpreadLayout } from '../components/SpreadLayout';
import { generateReading, generateCelticCrossReading, type CelticCrossReading } from '../logic/interpretation';
import { getCardById } from '../logic/deck';
import '../styles/result.css';

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
    const { lastDraw, userContext, sigilType } = useTarot();
    const [expandedPositions, setExpandedPositions] = useState<Set<string>>(new Set());
    const [currentSection, setCurrentSection] = useState(0);
    const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());

    const reading = useMemo(() => {
        if (!lastDraw || !userContext) return null;
        const ctx = { ...userContext, sigilType: sigilType || 'VIEQ' };
        if (lastDraw.spreadId === 'celtic_cross') {
            return generateCelticCrossReading(lastDraw.cards, ctx);
        }
        return generateReading(lastDraw.spreadId, lastDraw.cards, ctx);
    }, [lastDraw, userContext, sigilType]);

    // カードが公開されたときのコールバック
    const handleCardReveal = (positionId: string) => {
        setRevealedCards(prev => {
            const newSet = new Set(prev);
            newSet.add(positionId);
            return newSet;
        });
    };

    // すべてのカードが公開されたかチェック
    const allCardsRevealed = useMemo(() => {
        if (!lastDraw) return false;
        return lastDraw.cards.every(card => revealedCards.has(card.positionId));
    }, [lastDraw, revealedCards]);

    const handleNext = () => {
        setCurrentSection(prev => prev + 1);
    };

    if (!lastDraw || !userContext || !reading) {
        return (
            <div className="page-container result-page">
                <div className="mystic-header">
                    <h2>✦ 神託 ✦</h2>
                </div>
                <p className="intro-text">カードが引かれていません。</p>
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
            <div className="mystic-header">
                <h2>✨ カードたちからのメッセージ ✨</h2>
                <p className="header-subtitle">あなたの魂に贈る、星々の言葉</p>
            </div>

            <div className="spread-title">
                {lastDraw.spreadId === 'one_card' && '【一枚の啓示】'}
                {lastDraw.spreadId === 'three_card' && '【三枚の啓示】'}
                {lastDraw.spreadId === 'celtic_cross' && '【十枚の啓示 ― ケルト十字】'}
            </div>

            {/* Section 0: カード表示 */}
            <section className="spread-section fade-in">
                <p className="invitation">カードたちが、あなたを待っています。<br />優しく触れて、扉を開いてみましょう</p>
                <SpreadLayout
                    spreadId={lastDraw.spreadId}
                    cards={lastDraw.cards}
                    onCardReveal={handleCardReveal}
                />

                {/* ケルト十字の位置説明 */}
                {isCelticCross && (
                    <div className="position-guide">
                        <h4 className="guide-title">📍 各位置の意味</h4>
                        <div className="position-meanings">
                            <div className="position-item">
                                <span className="position-number">1️⃣</span>
                                <span className="position-desc">現在の核心 - 今の状況の中心</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">2️⃣</span>
                                <span className="position-desc">障害・交差 - 乗り越えるべき課題</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">3️⃣</span>
                                <span className="position-desc">根・土台 - 問題の根本原因</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">4️⃣</span>
                                <span className="position-desc">過去 - 去りつつある影響</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">5️⃣</span>
                                <span className="position-desc">顕在意識 - あなたが意識している想い</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">6️⃣</span>
                                <span className="position-desc">近未来 - 数週間〜数ヶ月先</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">7️⃣</span>
                                <span className="position-desc">自分自身 - あなたの態度・姿勢</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">8️⃣</span>
                                <span className="position-desc">周囲の影響 - 環境や他者からの影響</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">9️⃣</span>
                                <span className="position-desc">願望と恐れ - 心の深層</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">🔟</span>
                                <span className="position-desc">最終結果 - 辿り着く可能性</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* スリーカードの位置説明 */}
                {lastDraw.spreadId === 'three_card' && (
                    <div className="position-guide">
                        <h4 className="guide-title">📍 各位置の意味</h4>
                        <div className="position-meanings">
                            <div className="position-item">
                                <span className="position-number">🌑</span>
                                <span className="position-desc">左（過去）- 現状を作り出した過去の出来事</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">🌕</span>
                                <span className="position-desc">中央（現在）- 今直面している状況・課題</span>
                            </div>
                            <div className="position-item">
                                <span className="position-number">🌟</span>
                                <span className="position-desc">右（未来）- このまま進んだ場合の可能性</span>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {currentSection >= 0 && (
                <div className="next-button-container">
                    <button onClick={handleNext} className="next-btn mystic-btn warm-glow">
                        ✨ メッセージを受け取る
                    </button>
                </div>
            )}

            {/* Section 1: Thesis */}
            {currentSection >= 1 && (
                <section className="interpretation-section fade-in">
                    <div className="summary-box oracle-box">
                        <h3><span className="icon">🔮</span> カードたちの声</h3>
                        <p className="thesis-text">{reading.summary}</p>
                    </div>

                    {celticReading && (
                        <>
                            {celticReading.flowLine && (
                                <div className="detail-box flow-box">
                                    <h3><span className="icon">🌊</span> 時の流れ</h3>
                                    <p>{celticReading.flowLine}</p>
                                </div>
                            )}
                            {celticReading.conflictLine && (
                                <div className="detail-box conflict-box">
                                    <h3><span className="icon">⚔️</span> 葛藤の核</h3>
                                    <p>{celticReading.conflictLine}</p>
                                </div>
                            )}
                            {celticReading.leverLine && (
                                <div className="detail-box lever-box">
                                    <h3><span className="icon">✨</span> 変化の鍵</h3>
                                    <p>{celticReading.leverLine}</p>
                                </div>
                            )}
                        </>
                    )}
                </section>
            )}

            {currentSection >= 1 && currentSection < 2 && (
                <div className="next-button-container">
                    {allCardsRevealed ? (
                        <button onClick={handleNext} className="next-btn mystic-btn warm-glow">
                            📜 一枚一枚の物語を聴く
                        </button>
                    ) : (
                        <div className="cards-not-revealed-message">
                            <p className="gentle-reminder">
                                ✨ すべてのカードを開いてから、<br />
                                物語を聴いてみましょう
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Section 2: Details */}
            {currentSection >= 2 && (
                <section className="interpretation-section fade-in">
                    <div className="position-details">
                        <h3><span className="icon">📜</span> それぞれのカードが語ること</h3>
                        {reading.positionReadings.map(p => {
                            const positionName = POSITION_NAMES_JP[p.positionId] || p.positionId;
                            const isExpanded = expandedPositions.has(p.positionId);
                            const drawnCard = lastDraw.cards.find(c => c.positionId === p.positionId);
                            const cardDef = drawnCard ? getCardById(drawnCard.cardId) : null;

                            // カード画像パスを取得
                            const getCardImagePath = (card: typeof cardDef): string => {
                                if (!card) return '';
                                if (card.image_path) {
                                    return `/cards/${card.image_path}`;
                                }
                                return `/cards/${card.id}.png`;
                            };

                            return (
                                <div
                                    key={p.positionId}
                                    className={`reading-item ${isExpanded ? 'expanded' : ''}`}
                                    onClick={() => togglePosition(p.positionId)}
                                >
                                    <div className="reading-header">
                                        {/* カード画像サムネイル */}
                                        {cardDef && (
                                            <div className={`card-thumbnail ${drawnCard?.orientation === 'reversed' ? 'reversed' : ''}`}>
                                                <img
                                                    src={getCardImagePath(cardDef)}
                                                    alt={cardDef.name}
                                                    className="thumbnail-image"
                                                />
                                            </div>
                                        )}

                                        <div className="card-info">
                                            <h4>【{positionName}】</h4>
                                            {cardDef && (
                                                <span className="card-name">
                                                    {cardDef.name} ({drawnCard?.orientation === 'upright' ? '正位置' : '逆位置'})
                                                </span>
                                            )}
                                        </div>

                                        <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
                                    </div>
                                    {isExpanded && <p className="reading-text">{p.text}</p>}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {currentSection >= 2 && currentSection < 3 && (
                <div className="next-button-container">
                    <button onClick={handleNext} className="next-btn mystic-btn warm-glow">
                        💖 心に響くメッセージを受け取る
                    </button>
                </div>
            )}

            {/* Section 3: すべてのメッセージ（導き、今日の一歩、心に留めること）を一度に表示 */}
            {currentSection >= 3 && (
                <>
                    {reading.overallAdvice && (
                        <section className="interpretation-section fade-in">
                            <div className="advice-box">
                                <h3><span className="icon">💖</span> あなたへの導き</h3>
                                <p>{reading.overallAdvice}</p>
                            </div>
                        </section>
                    )}

                    <section className="interpretation-section fade-in">
                        <div className="ritual-box">
                            <h3><span className="icon">🌿</span> 小さな一歩から</h3>
                            <p>{reading.actionRitual}</p>
                        </div>
                    </section>

                    <section className="interpretation-section fade-in">
                        <div className="sign-box">
                            <h3><span className="icon">🌟</span> 心に留めておきたいこと</h3>
                            <p>{reading.signLine}</p>
                        </div>
                    </section>
                </>
            )}

            {currentSection >= 3 && currentSection < 4 && !isCelticCross && (
                <div className="next-button-container">
                    <button onClick={handleNext} className="next-btn mystic-btn warm-glow">
                        ✨ あなたらしさを見つめる
                    </button>
                </div>
            )}

            {/* Section 4: Type Lens */}
            {currentSection >= 4 && (
                <section className="interpretation-section fade-in">
                    <h3 className="section-title">✨ あなたらしさの輝き ✨</h3>
                    <p className="lens-text">{reading.typeLens}</p>
                </section>
            )}

            {currentSection >= 4 && currentSection < 5 && reading.synergyInsight && (
                <div className="next-button-container">
                    <button onClick={handleNext} className="next-btn mystic-btn warm-glow">
                        💖 最後の贈り物を受け取る
                    </button>
                </div>
            )}

            {/* Section 5: Synergy & Note Link */}
            {currentSection >= 5 && reading.synergyInsight && (
                <section className="interpretation-section synergy-section fade-in">
                    <h3 className="section-title">💖 あなただけへの言葉 💖</h3>
                    <p className="synergy-text">{reading.synergyInsight}</p>

                    {/* 占い師からの最後のメッセージ */}
                    <div className="final-blessing">
                        <p className="blessing-text">
                            このメッセージは、今日のあなたへの贈り物。<br />
                            心に留め、明日への一歩を踏み出してください。
                        </p>
                        <p className="blessing-emoji">✨🌟💖🌟✨</p>
                        <p className="hope-message">
                            あなたの未来は、光に満ちています。
                        </p>
                    </div>

                    {/* noteへの導線 */}
                    <div className="note-link-container" style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <a
                            href="https://note.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="primary-btn mystic-btn warm-glow"
                            style={{
                                display: 'inline-block',
                                textDecoration: 'none',
                                padding: '1.2rem 2rem',
                                fontSize: '1.1rem',
                                background: 'linear-gradient(135deg, #2d3436 0%, #000000 100%)',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}
                        >
                            🔮 あなたのタイプの「来月の運勢」を見る (note)
                        </a>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                            ※より詳細な運勢とアドバイスをお届けします
                        </p>
                    </div>
                </section>
            )}

            {/* Navigation - 最後まで表示したら */}
            {currentSection >= 5 && (
                <div className="actions fade-in">
                    <button onClick={() => navigate('/select-spread')} className="secondary-btn">
                        別のスプレッドで占う
                    </button>
                    <button onClick={() => navigate('/input')} className="primary-btn mystic-btn warm-glow">
                        🌸 また新しい相談をする
                    </button>
                </div>
            )}
        </div>
    );
};
