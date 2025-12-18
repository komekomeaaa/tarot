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
  image_path?: string;
}

export type SpreadType = 'one_card' | 'three_card' | 'celtic_cross';

export interface SpreadPosition {
  id: string; // "situation", "obstacle", "advice", etc.
  name: string;
  description: string;
  label?: string;  // オプショナルにして互換性維持
  x?: number;
  y?: number;
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

// カテゴリと期限の型定義（統一）
export type Category = 'love' | 'work' | 'money' | 'health' | 'relationship' | 'family';
export type Deadline = 'today' | 'week' | 'month' | 'longer';

export interface UserContext {
  category: Category;
  situation: string;
  deadline: Deadline;
  goal: string;
  sigilType?: string; // e.g., "VEQD"
  urgency?: number; // 1-5（オプショナル）

  // Phase 2: 拡張フィールド
  question?: string;          // 質問文（安全フィルターで使用）
  timeframe?: string;         // より詳細な期限
  hasOtherPerson?: boolean;   // 対人問題か
  canActNow?: boolean;        // 行動可能性
  stressLevel?: number;       // 互換性のため残す
}

// 16 Sigils Types  
export interface SigilAxis {
  code: string; // V, S, I, C, etc.
  name: string;
  description: string;
}

export type SigilCode = string; // 4 chars like "VEQD"

// 診断質問（Phase 7: 診断強化用）
export interface DiagnosisQuestion {
  id: number;
  text: string;
  axis: 'V' | 'S' | 'I' | 'C' | 'E' | 'L' | 'Q' | 'D';
}
