import type * as CharacterStatNames from "#/modules/profilesManagement/domain/CharacterStatNames";
import type { NonCalculatedCharacterSummaryStat } from "./CharacterSummaryStat";

type CharacterSummary = Record<
	CharacterStatNames.All,
	NonCalculatedCharacterSummaryStat
>;

export type { CharacterSummary };
