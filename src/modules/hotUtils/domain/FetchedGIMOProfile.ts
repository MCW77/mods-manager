import type { Mod } from "#/domain/Mod.js";
import type { PlayerValuesByCharacter } from "#/modules/profilesManagement/domain/PlayerValues.js";

export interface FetchedGIMOProfile {
	name: string;
	mods: Mod[];
	playerValues: PlayerValuesByCharacter;
	updated: boolean;
}
