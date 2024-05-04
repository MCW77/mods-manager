import type { SetStats } from "./Stats";

type SetRestrictions = Partial<Record<SetStats.GIMOStatNames, number>>;

export type { SetRestrictions };
