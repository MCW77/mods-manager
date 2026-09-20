// utils
import * as v from "valibot";

const CharacterStatsSchema = v.object({
	"Accuracy %": v.number(),
	Armor: v.number(),
	"Critical Avoidance %": v.number(),
	"Physical Critical Chance %": v.number(),
	"Special Critical Chance %": v.number(),
	"Critical Damage %": v.number(),
	"Physical Damage": v.number(),
	"Special Damage": v.number(),
	Health: v.number(),
	"Potency %": v.number(),
	Protection: v.number(),
	Resistance: v.number(),
	Speed: v.number(),
	"Tenacity %": v.number(),
});

export { CharacterStatsSchema };
