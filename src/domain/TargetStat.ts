// domain
import type { CharacterNames } from "#/constants/CharacterNames.js";

export const targetStatsNames = [
	"Accuracy",
	"Armor",
	"Critical Avoidance",
	"Critical Damage",
	"Health",
	"Health+Protection",
	"Physical Critical Chance",
	"Physical Damage",
	"Potency",
	"Protection",
	"Resistance",
	"Special Critical Chance",
	"Special Damage",
	"Speed",
	"Tenacity",
] as const;
export type TargetStatsNames = (typeof targetStatsNames)[number];

export type TargetStat = {
	id: string;
	stat: TargetStatsNames;
	type: "+" | "*";
	minimum: number;
	maximum: number;
	relativeCharacterId: CharacterNames | "null";
	optimizeForTarget: boolean;
};

export type TargetStats = TargetStat[];

export const createTargetStat = (
	stat: TargetStatsNames = "Speed",
	type: "+" | "*" = "+",
	minimum = 0,
	maximum = 0,
	relativeCharacterId: CharacterNames | "null" = "null",
	optimizeForTarget = true,
): TargetStat => ({
	id: crypto.randomUUID(),
	stat,
	type,
	minimum,
	maximum,
	relativeCharacterId,
	optimizeForTarget,
});
