import React, { useState } from 'react';
import { SpreadLayout } from '../components/SpreadLayout';
// Using logic directly for MVP demo
import { drawCards } from '../logic/deck';
import { generateReading } from '../logic/interpretation';
import type { DrawResult, UserContext } from '../types';

export const ReadingVerification: React.FC = () => {
    const [draw, setDraw] = useState<DrawResult | null>(null);
    const [reading, setReading] = useState<any>(null);

    const handleDraw = () => {
        // Mock 3 card
        const cards = drawCards(3);
        cards[0].positionId = 'situation';
        cards[1].positionId = 'obstacle';
        cards[2].positionId = 'advice';

        const result: DrawResult = {
            spreadId: 'three_card',
            drawDate: new Date().toISOString(),
            cards
        };
        setDraw(result);

        const ctx: UserContext = {
            category: 'love',
            situation: 'Test',
            deadline: 'week',
            stressLevel: 3,
            goal: 'Happiness',
            sigilCode: 'VIEQ'
        };

        const r = generateReading(result.spreadId, result.cards, ctx);
        setReading(r);
    };

    return (
        <div style={{ padding: 20 }}>
            <button onClick={handleDraw} style={{ padding: '10px 20px', background: 'gold', marginBottom: 20 }}>
                Draw 3 Cards
            </button>

            {draw && (
                <div style={{ marginBottom: 40 }}>
                    <SpreadLayout spreadId="three_card" cards={draw.cards} />
                </div>
            )}

            {reading && (
                <div style={{ maxWidth: 600, margin: '0 auto', background: '#1a1a1a', padding: 20, borderRadius: 8 }}>
                    <h2 style={{ color: 'gold' }}>Reading Result</h2>
                    <p style={{ fontWeight: 'bold' }}>{reading.summary}</p>
                    <hr style={{ borderColor: '#333', margin: '15px 0' }} />
                    {reading.positionReadings.map((p: any) => (
                        <div key={p.positionId} style={{ marginBottom: 10 }}>
                            <span style={{ color: '#aaa', fontSize: '0.8em' }}>{p.positionId.toUpperCase()}: </span>
                            {p.text}
                        </div>
                    ))}
                    <hr style={{ borderColor: '#333', margin: '15px 0' }} />
                    <p style={{ color: '#88f' }}>{reading.overallAdvice}</p>
                </div>
            )}
        </div>
    );
};
