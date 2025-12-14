import type { Mod } from "#/domain/Mod";
import type { PlayerValuesByCharacter } from "#/modules/profilesManagement/domain/PlayerValues";

export interface FetchedGIMOProfile {
	name: string;
	mods: Mod[];
	playerValues: PlayerValuesByCharacter;
	updated: boolean;
}
