// domain
import type { OptimizationPlan } from "#/domain/OptimizationPlan";

export const DamageType = {
	physical: 1,
	special: 0,
	mixed: 0.5,
} as const;

export interface CharacterSettings {
	targets: OptimizationPlan[];
	extraTags: string[];
	damageType: number;
}

export const createCharacterSettings = (
	targets: OptimizationPlan[] = [],
	extraTags: string[] = [],
	damageType: number = DamageType.physical,
) => {
	return {
		targets,
		extraTags,
		damageType,
	};
};
