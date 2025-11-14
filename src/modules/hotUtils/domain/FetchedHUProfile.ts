// domain
import type { HUFlatMod } from "#/domain/types/ModTypes.js";
import type { HUPlayerValuesDTO } from "#/modules/profilesManagement/dtos/hu/index.js";

export interface FetchedHUProfile {
	allycode: number;
	name: string;
	guild: string;
	mods: HUFlatMod[];
	characters: HUPlayerValuesDTO[];
	updated?: boolean;
}
