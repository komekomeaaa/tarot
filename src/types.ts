export type ArcanaType = 'major' | 'minor';
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles' | null;
export type RankType = 'page' | 'knight' | 'queen' | 'king' | number | null;
export type CardOrientation = 'upright' | 'reversed';

export interface CardDefinition {
  id: string; // e.g., "MA_00", "CU_01"
  arcana: ArcanaType;
  name: string;
  number: number; // 0-21 for Major, 1-14 for Minor (Ace=1, King=14)
  suit: SuitType;
  rank: RankType; 
  keywords_upright: string[];
  keywords_reversed: string[];
  domains?: string[]; // Optional domain keywords
  intensity?: number; // 1-5?
}

export type SpreadType = 'one_card' | 'three_card' | 'celtic_cross';

export interface SpreadPosition {
  id: string; // "situation", "obstacle", "advice", etc.
  name: string;
  description: string;
}

export interface SpreadDefinition {
  id: SpreadType;
  name: string;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  positionId: string;
  cardId: string;
  orientation: CardOrientation;
}

export interface DrawResult {
  spreadId: SpreadType;
  drawDate: string; // ISO string
  cards: DrawnCard[];
}

export interface UserContext {
  category: 'love' | 'work' | 'money' | 'health' | 'family' | 'human_relations';
  situation: string;
  deadline: 'today' | 'week' | 'month' | '3months';
  stressLevel: number; // 1-5
  goal: string;
  sigilCode?: string; // e.g. "VIEQ"
}

// 16 Sigils Types
export interface SigilAxis {
  code: string; // V, S, I, C, etc.
  name: string;
  description: string;
}

export type SigilCode = string; // 4 chars
