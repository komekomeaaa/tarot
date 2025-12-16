import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTarot } from '../context/TarotContext';
import type { SpreadType } from '../types';
import { drawCards } from '../logic/deck';
import { SPREADS } from '../data/spreads';

const SPREAD_NAMES_JP: Record<SpreadType, { name: string; description: string; icon: string }> = {
    one_card: { name: 'ワンカード', description: '今日のメッセージ・シンプルな答え', icon: '🃏' },
    three_card: { name: 'スリーカード', description: '過去・現在・未来 / 状況・障害・助言', icon: '🎴' },
    celtic_cross: { name: 'ケルト十字', description: '人生の複雑な問題を深く読み解く', icon: '✝️' },
};

export const SpreadSelectionPage: React.FC = () => {
    const navigate = useNavigate();
    const { setLastDraw } = useTarot();

    const handleSelectSpread = (spreadId: SpreadType) => {
        let count = 0;
        if (spreadId === 'one_card') count = 1;
        if (spreadId === 'three_card') count = 3;
        if (spreadId === 'celtic_cross') count = 10;

        const drawn = drawCards(count);

        if (spreadId === 'three_card') {
            drawn[0].positionId = 'situation';
            drawn[1].positionId = 'obstacle';
            drawn[2].positionId = 'advice';
        } else if (spreadId === 'one_card') {
            drawn[0].positionId = 'theme';
        } else if (spreadId === 'celtic_cross') {
            const positions = [
                'present', 'challenge', 'foundation', 'past', 'conscious',
                'near_future', 'self', 'environment', 'hopes_fears', 'outcome'
            ];
            drawn.forEach((d, i) => {
                if (positions[i]) d.positionId = positions[i];
            });
        }

        setLastDraw({
            spreadId,
            drawDate: new Date().toISOString(),
            cards: drawn
        });

        navigate('/result');
    };

    return (
        <div className="page-container spread-page">
            <div className="mystic-header">
                <h2>✧ スプレッドを選ぶ ✧</h2>
            </div>
            <p className="intro-text">
                カードの並べ方を選んでください。<br />
                問いの深さに応じて、ふさわしい展開法をお選びください。
            </p>

            <div className="spread-options">
                {SPREADS.map(spread => {
                    const info = SPREAD_NAMES_JP[spread.id];
                    return (
                        <button
                            key={spread.id}
                            className="spread-card"
                            onClick={() => handleSelectSpread(spread.id)}
                        >
                            <span className="spread-icon">{info.icon}</span>
                            <h3>{info.name}</h3>
                            <p>{info.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
