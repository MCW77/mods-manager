// utils
import * as v from "valibot";

// domain
import {
	type CharacterNames,
	characterNames,
} from "#/constants/CharacterNames.js";
import { KnownCharacterNamesSchema, OptimizationPlanSchema } from "./index.js";
import type { Character } from "#/domain/Character.js";

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

// Default character stats with all values set to 0
const defaultCharacterStats = {
	"Accuracy %": 0,
	Armor: 0,
	"Critical Avoidance %": 0,
	"Physical Critical Chance %": 0,
	"Special Critical Chance %": 0,
	"Critical Damage %": 0,
	"Physical Damage": 0,
	"Special Damage": 0,
	Health: 0,
	"Potency %": 0,
	Protection: 0,
	Resistance: 0,
	Speed: 0,
	"Tenacity %": 0,
};

// Default character object for missing character entries
const createDefaultCharacter = (
	characterId: v.InferInput<typeof KnownCharacterNamesSchema>,
) => ({
	id: characterId,
	playerValues: {
		galacticPower: 0,
		gearLevel: 0,
		gearPieces: [] as string[],
		level: 0,
		relicTier: 0,
		stars: 0,
		baseStats: { ...defaultCharacterStats },
		equippedStats: { ...defaultCharacterStats },
	},
	targets: [] as v.InferInput<typeof OptimizationPlanSchema>[],
});

const CharacterByIdSchema = v.pipe(
	v.record(v.string(), CharacterSchema),
	v.transform((input) => {
		// Add missing character entries with default values
		const result = { ...input };
		for (const characterName of characterNames) {
			if (!(characterName in result)) {
				result[characterName] = createDefaultCharacter(characterName);
			}
		}
		return result as Record<CharacterNames, Character>;
	}),
);

export { CharacterByIdSchema };
