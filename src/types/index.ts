export type BetHand = 'rock' | 'paper' | 'scissor';
export type BetResult = 'win' | 'lose' | 'tie';

export interface PlaceBetData {
    instruction: number;
    amount: number;
}

export interface FightData {
    instruction: number;
    hand: number;
}
