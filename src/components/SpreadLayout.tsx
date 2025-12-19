import React, { useState } from 'react';
import type { DrawnCard, SpreadType } from '../types';
import { Card } from './Card';
import { getCardById } from '../logic/deck';
import '../styles/spread.css';

interface SpreadLayoutProps {
    spreadId: SpreadType;
    cards: DrawnCard[];
    onCardReveal?: (positionId: string) => void;
}

// 日本語ラベル
const POSITION_LABELS_JP: Record<string, string> = {
    present: '1. 現在',
    challenge: '2. 障害',
    foundation: '3. 根・土台',
    past: '4. 過去',
    conscious: '5. 顕在意識',
    near_future: '6. 近未来',
    self: '7. 自分',
    environment: '8. 周囲',
    hopes_fears: '9. 願望・恐れ',
    outcome: '10. 結果',
};

// 順番の定義
const CELTIC_CROSS_ORDER = [
    'present', 'challenge', 'foundation', 'past', 'conscious',
    'near_future', 'self', 'environment', 'hopes_fears', 'outcome'
];

export const SpreadLayout: React.FC<SpreadLayoutProps> = ({ spreadId, cards, onCardReveal }) => {
    const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

    // 次にめくるべきカードのインデックス
    const nextCardIndex = CELTIC_CROSS_ORDER.findIndex(posId => !revealedIds.has(posId));

    const handleCardClick = (drawn: DrawnCard) => {
        if (revealedIds.has(drawn.positionId)) return;

        // ケルト十字の場合、順番通りにしかめくれない
        if (spreadId === 'celtic_cross') {
            const cardOrderIndex = CELTIC_CROSS_ORDER.indexOf(drawn.positionId);
            if (cardOrderIndex !== nextCardIndex) {
                return;
            }
        }

        const newRevealed = new Set(revealedIds);
        newRevealed.add(drawn.positionId);
        setRevealedIds(newRevealed);

        if (onCardReveal) onCardReveal(drawn.positionId);
    };

    const getCardByPos = (posId: string) => cards.find(c => c.positionId === posId);

    const renderCardSlot = (posId: string, label: string) => {
        const drawn = getCardByPos(posId);
        if (!drawn) return <div className="card-slot empty"><span className="slot-label">{label}</span></div>;

        const cardDef = getCardById(drawn.cardId);
        const isRevealed = revealedIds.has(posId);

        const isNextToReveal = spreadId === 'celtic_cross' &&
            CELTIC_CROSS_ORDER.indexOf(posId) === nextCardIndex;

        const isLocked = spreadId === 'celtic_cross' &&
            !isRevealed &&
            CELTIC_CROSS_ORDER.indexOf(posId) > nextCardIndex;

        // キーワード取得
        const keywords = isRevealed && cardDef ?
            (drawn.orientation === 'upright' ? cardDef.keywords_upright : cardDef.keywords_reversed) : [];

        return (
            <div className={`card-slot slot-${posId} ${isNextToReveal ? 'next-to-reveal' : ''} ${isLocked ? 'locked' : ''}`} key={posId}>
                <div className="card-image-wrapper">
                    <Card
                        card={cardDef}
                        orientation={drawn.orientation}
                        isRevealed={isRevealed}
                        onClick={() => handleCardClick(drawn)}
                        size="sm"
                    />

                    {/* めくった時のキーワード表示（4つ） */}
                    {isRevealed && keywords.length > 0 && (
                        <div className="card-keyword-popup">
                            <span className="keyword-text">
                                {keywords.slice(0, 4).join('・')}
                            </span>
                        </div>
                    )}
                </div>
                <span className="slot-label">{label}</span>
            </div>
        );
    };

    if (spreadId === 'celtic_cross') {
        return (
            <div className="spread-container celtic-cross">
                <div className="center-cross">
                    {renderCardSlot('present', POSITION_LABELS_JP.present)}
                    <div className="crossing-card">
                        {renderCardSlot('challenge', POSITION_LABELS_JP.challenge)}
                    </div>
                </div>
                <div className="surrounding">
                    {renderCardSlot('foundation', POSITION_LABELS_JP.foundation)}
                    {renderCardSlot('past', POSITION_LABELS_JP.past)}
                    {renderCardSlot('conscious', POSITION_LABELS_JP.conscious)}
                    {renderCardSlot('near_future', POSITION_LABELS_JP.near_future)}
                </div>
                <div className="staff">
                    {renderCardSlot('self', POSITION_LABELS_JP.self)}
                    {renderCardSlot('environment', POSITION_LABELS_JP.environment)}
                    {renderCardSlot('hopes_fears', POSITION_LABELS_JP.hopes_fears)}
                    {renderCardSlot('outcome', POSITION_LABELS_JP.outcome)}
                </div>

                {/* 順番ガイド */}
                {nextCardIndex >= 0 && nextCardIndex < 10 && (
                    <div className="order-guide">
                        <p>👆 「{POSITION_LABELS_JP[CELTIC_CROSS_ORDER[nextCardIndex]]}」をタップしてめくってください</p>
                    </div>
                )}
                {nextCardIndex === -1 && (
                    <div className="order-guide complete">
                        <p>✨ すべてのカードが開きました ✨</p>
                    </div>
                )}
            </div>
        );
    }

    return <div>Unknown Spread</div>;
};
