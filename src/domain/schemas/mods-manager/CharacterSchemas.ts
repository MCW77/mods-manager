// utils
import * as v from "valibot";

// domain
import {
	type CharacterNames,
	characterNames,
} from "#/constants/CharacterNames";
import {
	CharacterStatsSchema,
	KnownCharacterNamesSchema,
	OptimizationPlanSchema,
	OptimizationPlanSchemaV26,
	OptimizationPlanSchemaV31,
} from "./index";
import type { Character } from "#/domain/Character";
import type { CharacterStats } from "#/domain/CharacterStats";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";

const CharacterSchema = v.object({
	id: KnownCharacterNamesSchema,
	playerValues: v.object({
		galacticPower: v.number(),
		gearLevel: v.number(),
		gearPieces: v.array(v.string()),
		level: v.number(),
		relicTier: v.number(),
		stars: v.number(),
		baseStats: CharacterStatsSchema,
		equippedStats: CharacterStatsSchema,
	}),
	targets: v.array(OptimizationPlanSchema),
});

const CharacterSchemaV23 = v.object({
	id: KnownCharacterNamesSchema,
	omis: v.array(v.string()),
	playerValues: v.object({
		galacticPower: v.number(),
		gearLevel: v.number(),
		gearPieces: v.array(v.string()),
		level: v.number(),
		relicTier: v.number(),
		stars: v.number(),
		baseStats: CharacterStatsSchema,
		equippedStats: CharacterStatsSchema,
	}),
	targets: v.array(OptimizationPlanSchema),
	zetas: v.array(v.string()),
});
type CharacterSchemaV23Output = v.InferOutput<typeof CharacterSchemaV23>;

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

const createDefaultCharacterV23 = (
	characterId: v.InferInput<typeof KnownCharacterNamesSchema>,
) => ({
	id: characterId,
	omis: [] as string[],
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
	zetas: [] as string[],
});

const createDefaultCharacterV26 = (
	characterId: v.InferInput<typeof KnownCharacterNamesSchema>,
) => ({
	id: characterId,
	omis: [] as string[],
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
	targets: [] as v.InferInput<typeof OptimizationPlanSchemaV26>[],
	zetas: [] as string[],
});

const createDefaultCharacterV30 = (
	characterId: v.InferInput<typeof KnownCharacterNamesSchema>,
) => ({
	id: characterId,
	omis: [] as string[],
	playerValues: {
		galacticPower: 0,
		gearLevel: 0,
		gearPieces: [] as string[],
		level: 0,
		relicTier: 0,
		stars: 0,
		equippedStats: { ...defaultCharacterStats },
	},
	targets: [] as v.InferInput<typeof OptimizationPlanSchemaV26>[],
	zetas: [] as string[],
});

const createDefaultCharacterV31 = (
	characterId: v.InferInput<typeof KnownCharacterNamesSchema>,
) => ({
	id: characterId,
	omis: [] as string[],
	playerValues: {
		galacticPower: 0,
		gearLevel: 0,
		gearPieces: [] as string[],
		level: 0,
		relicTier: 0,
		stars: 0,
		equippedStats: { ...defaultCharacterStats },
	},
	targets: [] as v.InferInput<typeof OptimizationPlanSchemaV31>[],
	zetas: [] as string[],
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
		return result as Record<
			CharacterNames,
			{
				id: CharacterNames;
				omis: string[];
				playerValues: {
					level: number;
					stars: number;
					gearLevel: number;
					gearPieces: string[];
					galacticPower: number;
					baseStats: CharacterStats;
					equippedStats: CharacterStats;
					relicTier: number;
				};
				targets: OptimizationPlan[];
				zetas: string[];
			}
		>;
	}),
);

const CharacterByIdSchemaV23 = v.pipe(
	v.record(v.string(), CharacterSchemaV23),
	v.transform((input) => {
		// Add missing character entries with default values
		const result = { ...input };
		for (const characterName of characterNames) {
			if (!(characterName in result)) {
				result[characterName] = createDefaultCharacterV23(characterName);
			}
		}
		return result as Record<CharacterNames, CharacterSchemaV23Output>;
	}),
);

const CharacterSchemaV26 = v.object({
	id: KnownCharacterNamesSchema,
	omis: v.array(v.string()),
	playerValues: v.object({
		galacticPower: v.number(),
		gearLevel: v.number(),
		gearPieces: v.array(v.string()),
		level: v.number(),
		relicTier: v.number(),
		stars: v.number(),
		baseStats: CharacterStatsSchema,
		equippedStats: CharacterStatsSchema,
	}),
	targets: v.array(OptimizationPlanSchemaV26),
	zetas: v.array(v.string()),
});
type CharacterSchemav26Output = v.InferOutput<typeof CharacterSchemaV26>;

const CharacterByIdSchemaV26 = v.pipe(
	v.record(v.string(), CharacterSchemaV26),
	v.transform((input) => {
		// Add missing character entries with default values
		const result = { ...input };
		for (const characterName of characterNames) {
			if (!(characterName in result)) {
				result[characterName] = createDefaultCharacterV26(characterName);
			}
		}
		return result as Record<CharacterNames, CharacterSchemav26Output>;
	}),
);

const CharacterSchemaV30 = v.object({
	id: KnownCharacterNamesSchema,
	omis: v.array(v.string()),
	playerValues: v.object({
		galacticPower: v.number(),
		gearLevel: v.number(),
		gearPieces: v.array(v.string()),
		level: v.number(),
		relicTier: v.number(),
		stars: v.number(),
		equippedStats: CharacterStatsSchema,
	}),
	targets: v.array(OptimizationPlanSchemaV26),
	zetas: v.array(v.string()),
});

const CharacterByIdSchemaV30 = v.pipe(
	v.record(v.string(), CharacterSchemaV30),
	v.transform((input) => {
		// Add missing character entries with default values
		const result = { ...input };
		for (const characterName of characterNames) {
			if (!(characterName in result)) {
				result[characterName] = createDefaultCharacterV30(characterName);
			}
		}
		return result as Record<CharacterNames, Character>;
	}),
);

const CharacterSchemaV31 = v.object({
	id: KnownCharacterNamesSchema,
	omis: v.array(v.string()),
	playerValues: v.object({
		galacticPower: v.number(),
		gearLevel: v.number(),
		gearPieces: v.array(v.string()),
		level: v.number(),
		relicTier: v.number(),
		stars: v.number(),
		equippedStats: CharacterStatsSchema,
	}),
	targets: v.array(OptimizationPlanSchemaV31),
	zetas: v.array(v.string()),
});
type CharacterSchemaV31Output = v.InferOutput<typeof CharacterSchemaV31>;

const CharacterByIdSchemaV31 = v.pipe(
	v.record(v.string(), CharacterSchemaV31),
	v.transform((input) => {
		// Add missing character entries with default values
		const result = { ...input };
		for (const characterName of characterNames) {
			if (!(characterName in result)) {
				result[characterName] = createDefaultCharacterV31(characterName);
			}
		}
		return result as Record<CharacterNames, CharacterSchemaV31Output>;
	}),
);

export {
	CharacterByIdSchema,
	CharacterByIdSchemaV23,
	CharacterByIdSchemaV26,
	CharacterByIdSchemaV30,
	CharacterByIdSchemaV31,
};
