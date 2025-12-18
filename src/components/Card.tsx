import React, { useState } from 'react';
import type { CardDefinition, CardOrientation } from '../types';
import '../styles/card.css';

interface CardProps {
    card?: CardDefinition;
    orientation: CardOrientation;
    isRevealed: boolean;
    onClick?: () => void;
    size?: 'sm' | 'md' | 'lg';
}

// カードIDから画像ファイル名へのマッピング
const getCardImagePath = (card: CardDefinition): string => {
    const id = card.id;

    // Major Arcana (MA_XX format)
    if (id.startsWith('MA_')) {
        const num = id.split('_')[1];
        const majorNames: Record<string, string> = {
            '00': 'fool',
            '01': 'magician',
            '02': 'high_priestess',
            '03': 'empress',
            '04': 'emperor',
            '05': 'hierophant',
            '06': 'lovers',
            '07': 'chariot',
            '08': 'strength',
            '09': 'hermit',
            '10': 'wheel',
            '11': 'justice',
            '12': 'hanged_man',
            '13': 'death',
            '14': 'temperance',
            '15': 'devil',
            '16': 'tower',
            '17': 'star',
            '18': 'moon',
            '19': 'sun',
            '20': 'judgement',
            '21': 'world'
        };
        return `/cards/tarot_${num}_${majorNames[num]}.png`;
    }

    // Minor Arcana (suit_rank format)
    const suit = card.suit;
    const rank = card.rank;

    if (suit && rank !== null) {
        const suitName = suit.toLowerCase();
        let rankName: string;

        if (rank === 1) {
            rankName = 'ace';
        } else if (typeof rank === 'string') {
            rankName = rank.toLowerCase();
        } else {
            rankName = String(rank).padStart(2, '0');
        }

        return `/cards/${suitName}_${rankName}.png`;
    }

    // フォールバック
    return '/cards/card_back.png';
};

export const Card: React.FC<CardProps> = ({ card, orientation, isRevealed, onClick, size = 'md' }) => {
    const isReversed = orientation === 'reversed';
    const [isFlipping, setIsFlipping] = useState(false);

    const handleClick = () => {
        if (!isRevealed && onClick) {
            setIsFlipping(true);
            setTimeout(() => {
                onClick();
                setIsFlipping(false);
            }, 600);
        }
    };

    return (
        <div
            className={`tarot-card-container size-${size} ${isRevealed ? 'revealed' : ''} ${isReversed ? 'reversed' : ''} ${isFlipping ? 'flipping' : ''}`}
            onClick={handleClick}
        >
            <div className="tarot-card-inner">
                {/* Back of Card */}
                <div className="tarot-card-back">
                    <img
                        src="/cards/card_back.png"
                        alt="Card Back"
                        className="card-back-image"
                    />
                </div>

                {/* Front of Card */}
                <div className="tarot-card-front">
                    {card ? (
                        <>
                            <img
                                src={getCardImagePath(card)}
                                alt={card.name}
                                className="card-image"
                            />
                            <div className="card-name-overlay">
                                <span className="card-name">{card.name}</span>
                                {orientation === 'reversed' && (
                                    <span className="orientation-label">逆位置</span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="card-error">?</div>
                    )}
                </div>
            </div>
        </div>
    );
};
