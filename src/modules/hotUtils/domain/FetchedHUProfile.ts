// domain
import type { HUFlatMod } from "#/domain/types/ModTypes";
import type { HUPlayerValuesDTO } from "#/modules/profilesManagement/dtos/hu/index";

export interface FetchedHUProfile {
	allycode: number;
	name: string;
	guild: string;
	mods: HUFlatMod[];
	characters: HUPlayerValuesDTO[];
	updated?: boolean;
}
