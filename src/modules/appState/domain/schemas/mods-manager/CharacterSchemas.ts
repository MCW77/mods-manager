import * as v from "valibot";
import { characterNames } from "#/constants/CharacterNames";
import {
	KnownCharacterNamesSchema,
	OptimizationPlanSchema,
} from "./";

const CharacterStatsDTOSchema = v.object({
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

const CharacterSchema = v.object({
	id: KnownCharacterNamesSchema,
	playerValues: v.object({
		galacticPower: v.number(),
		gearLevel: v.number(),
		gearPieces: v.array(v.string()),
		level: v.number(),
		relicTier: v.number(),
		stars: v.number(),
		baseStats: CharacterStatsDTOSchema,
		equippedStats: CharacterStatsDTOSchema,
	}),
	targets: v.array(OptimizationPlanSchema),
});

const CharacterByIdSchema = v.looseObject(
	v.entriesFromList(characterNames, CharacterSchema),
);

export { CharacterByIdSchema };
