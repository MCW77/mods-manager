import type { ModTiersEnum } from "#/constants/enums.js";
import type * as ModTypes from "../types/ModTypes.js";

export const gimoSlots: ModTypes.GIMOSlots[] = [
	"square",
	"arrow",
	"diamond",
	"triangle",
	"circle",
	"cross",
];

export const tiersMap: Map<ModTiersEnum, string> = new Map([
	[5, "mod-gold"],
	[4, "mod-purple"],
	[3, "mod-blue"],
	[2, "mod-green"],
	[1, "mod-grey"],
]);
