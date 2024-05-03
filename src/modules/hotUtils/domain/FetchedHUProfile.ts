import type { HUFlatMod } from "#/domain/types/ModTypes";

export interface FetchedHUProfile {
	allycode: number;
	name: string;
	guild: string;
	mods: HUFlatMod[];
	characters: any;
	updated?: boolean;
}
