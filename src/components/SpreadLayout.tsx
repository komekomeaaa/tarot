import React, { useState } from 'react';
import type { DrawnCard, SpreadType } from '../types';
import { Card } from './Card';
import { getCardById } from '../logic/deck';
import '../styles/spread.css';

interface SpreadLayoutProps {
    spreadId: SpreadType;
    cards: DrawnCard[]; // Should be ordered by position logic or filtered
    onCardReveal?: (positionId: string) => void;
}

export const SpreadLayout: React.FC<SpreadLayoutProps> = ({ spreadId, cards, onCardReveal }) => {
    const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

    const handleCardClick = (drawn: DrawnCard) => {
        if (revealedIds.has(drawn.positionId)) return;

        const newRevealed = new Set(revealedIds);
        newRevealed.add(drawn.positionId);
        setRevealedIds(newRevealed);

        if (onCardReveal) onCardReveal(drawn.positionId);
    };

    // Auto-reveal logic? Or manual? 
    // Let's allow manual clicking for "experience".

    // Helper to find card by position ID (or index if simpler)
    // For Celtic Cross, positions are strict.
    // We need to map cards to slots.

    const getCardByPos = (posId: string) => cards.find(c => c.positionId === posId);

    const renderCardSlot = (posId: string, label: string) => {
        const drawn = getCardByPos(posId);
        if (!drawn) return <div className="card-slot empty"><span className="slot-label">{label}</span></div>;

        const cardDef = getCardById(drawn.cardId);
        const isRevealed = revealedIds.has(posId);

        return (
            <div className={`card-slot slot-${posId}`} key={posId}>
                <Card
                    card={cardDef}
                    orientation={drawn.orientation}
                    isRevealed={isRevealed}
                    onClick={() => handleCardClick(drawn)}
                    size="sm"
                />
                <span className="slot-label">{label}</span>
            </div>
        );
    };

    if (spreadId === 'one_card') {
        return (
            <div className="spread-container one-card">
                {renderCardSlot('theme', 'Theme')}
            </div>
        );
    }

    if (spreadId === 'three_card') {
        return (
            <div className="spread-container three-card">
                {renderCardSlot('situation', 'Situation')}
                {renderCardSlot('obstacle', 'Obstacle')}
                {renderCardSlot('advice', 'Advice')}
            </div>
        );
    }

    if (spreadId === 'celtic_cross') {
        return (
            <div className="spread-container celtic-cross">
                <div className="center-cross">
                    {renderCardSlot('present', '1. Present')}
                    <div className="crossing-card">
                        {renderCardSlot('challenge', '2. Challenge')}
                    </div>
                </div>
                <div className="surrounding">
                    {renderCardSlot('foundation', '3. Foundation')}
                    {renderCardSlot('past', '4. Past')}
                    {renderCardSlot('conscious', '5. Conscious')}
                    {renderCardSlot('near_future', '6. Future')}
                </div>
                <div className="staff">
                    {renderCardSlot('self', '7. Self')}
                    {renderCardSlot('environment', '8. Env')}
                    {renderCardSlot('hopes_fears', '9. Hopes')}
                    {renderCardSlot('outcome', '10. Outcome')}
                </div>
            </div>
        );
    }

    return <div>Unknown Spread</div>;
};
