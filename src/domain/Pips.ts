export const pips = [1, 2, 3, 4, 5, 6] as const;
export type Pips = (typeof pips)[number];
