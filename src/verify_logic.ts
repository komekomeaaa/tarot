import { drawCards } from './logic/deck';
import { generateReading } from './logic/interpretation';
import type { UserContext } from './types';

// Mock User Context
const mockContext: UserContext = {
    category: 'love',
    situation: 'Trying to contact someone.',
    deadline: 'week',
    stressLevel: 4,
    goal: 'Reconnect',
    sigilType: 'VIEQ'
};

// Test Draw (3 cards)
console.log("--- Drawing 3 cards for Situation / Obstacle / Advice ---");
const draw = {
    spreadId: 'three_card' as const,
    drawDate: new Date().toISOString(),
    cards: drawCards(3)
};

// Manually assign positions for testing
draw.cards[0].positionId = 'situation';
draw.cards[1].positionId = 'obstacle';
draw.cards[2].positionId = 'advice';

console.log("Cards drawn:", draw.cards.map(c => `${c.positionId}: ${c.cardId} (${c.orientation})`));

// Test Interpretation
console.log("\n--- Generating Reading ---");
const reading = generateReading(draw.spreadId, draw.cards, mockContext);

console.log("Summary:", reading.summary);
console.log("Overall Advice:", reading.overallAdvice);
console.log("\nPosition Readings:");
reading.positionReadings.forEach(p => {
    console.log(`[${p.positionId}] ${p.text}`);
});
