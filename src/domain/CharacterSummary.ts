import type * as CharacterStatNames from "./CharacterStatNames";
import type { NonCalculatedCharacterSummaryStat } from "./CharacterSummaryStat";

type CharacterSummary = Record<
	CharacterStatNames.All,
	NonCalculatedCharacterSummaryStat
>;

export type { CharacterSummary };
