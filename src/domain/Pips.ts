export const pips = [5, 6] as const;
export type Pips = (typeof pips)[number];
