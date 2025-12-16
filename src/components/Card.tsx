import React from 'react';
import type { CardDefinition, CardOrientation } from '../types';
import '../styles/card.css';

interface CardProps {
    card?: CardDefinition;
    orientation: CardOrientation;
    isRevealed: boolean;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ card, orientation, isRevealed, onClick, size = 'md' }) => {
    const isReversed = orientation === 'reversed';

    return (
        <div
            className={`tarot-card-container size-${size} ${isRevealed ? 'revealed' : ''} ${isReversed ? 'reversed' : ''}`}
            onClick={onClick}
        >
            <div className="tarot-card-inner">
                {/* Back of Card */}
                <div className="tarot-card-back">
                    <div className="back-pattern"></div>
                </div>

                {/* Front of Card */}
                <div className="tarot-card-front">
                    {card ? (
                        <div className={`card-content arcana-${card.arcana}`}>
                            {/* Placeholder for real images - using CSS art for now */}
                            <div className="card-top">
                                <span className="card-number">{card.number}</span>
                            </div>
                            <div className="card-center">
                                <h3>{card.name}</h3>
                                {card.suit && <div className={`suit-icon suit-${card.suit}`}></div>}
                            </div>
                            <div className="card-bottom">
                                <span className="card-keywords">{card.keywords_upright[0]}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="card-error">?</div>
                    )}
                </div>
            </div>
        </div>
    );
};
