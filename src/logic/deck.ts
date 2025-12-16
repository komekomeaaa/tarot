import type { CardDefinition, DrawnCard, CardOrientation } from '../types';
import { CARDS } from '../data/cards';

// Fisher-Yates Shuffle
export function shuffleDeck(cards: CardDefinition[] = CARDS): CardDefinition[] {
    const deck = [...cards];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

export function drawCards(count: number): DrawnCard[] {
    const deck = shuffleDeck(CARDS);
    const hand = deck.slice(0, count);

    return hand.map((card, index) => {
        // Specification says "reversed is used for weak/inward/delay". 
        // Let's stick to true random 50% or maybe 40% reversed to avoid too much negativity in MVP?
        // User spec doesn't specify probability. Standard tarot shuffling usually results in ~50%.
        // I will use 0.4 (40%) probability for reversed to keep it balanced but slightly upright-biased for better UX.

        const orientation: CardOrientation = Math.random() < 0.4 ? 'reversed' : 'upright';

        return {
            positionId: `pos_${index}`, // Placeholder, needs to be mapped to spread positions
            cardId: card.id,
            orientation
        };
    });
}

export function getCardById(id: string): CardDefinition | undefined {
    return CARDS.find(c => c.id === id);
}
