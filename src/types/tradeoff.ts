export interface TradeoffOption {
  title: string;
  pros: string[];
  cons: string[];
  monthlyImpact: number; // positive = more money, negative = less money
  description?: string;
}

export type TradeoffCategory = 'housing' | 'savings' | 'debt' | 'lifestyle';

export interface TradeoffCard {
  id: string;
  title: string; // e.g., "Living Situation"
  optionA: TradeoffOption;
  optionB: TradeoffOption;
  category: TradeoffCategory;
}
