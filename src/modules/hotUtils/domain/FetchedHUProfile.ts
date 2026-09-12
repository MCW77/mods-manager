// domain
import type { HUFlatMod } from "#/domain/types/ModTypes";
import type { HUPlayerValues } from "./HUPlayerValues";

export interface FetchedHUProfile {
	allycode: number;
	name: string;
	guild: string;
	mods: HUFlatMod[];
	characters: HUPlayerValues[];
	updated?: boolean;
}
