// utils
import type * as v from "valibot";

// domain
import type { SetRestrictions } from "#/domain/SetRestrictions";
import type { SetRestrictionsSchema as GIMOSetRestrictionsSchema } from "#/domain/schemas/gimo/OptimizationPlanSchemas";

type GIMOSetRestrictions = v.InferOutput<typeof GIMOSetRestrictionsSchema>;

export const fromGIMOSetRestrictions = (
	setRestrictions: GIMOSetRestrictions,
): SetRestrictions => {
	const transformedSetRestrictions: SetRestrictions = {};
	if (setRestrictions.critchance) {
		transformedSetRestrictions["Critical Chance %"] =
			setRestrictions.critchance;
	}
	if (setRestrictions.critdamage) {
		transformedSetRestrictions["Critical Damage %"] =
			setRestrictions.critdamage;
	}
	if (setRestrictions.defense) {
		transformedSetRestrictions["Defense %"] = setRestrictions.defense;
	}
	if (setRestrictions.health) {
		transformedSetRestrictions["Health %"] = setRestrictions.health;
	}
	if (setRestrictions.offense) {
		transformedSetRestrictions["Offense %"] = setRestrictions.offense;
	}
	if (setRestrictions.potency) {
		transformedSetRestrictions["Potency %"] = setRestrictions.potency;
	}
	if (setRestrictions.speed) {
		transformedSetRestrictions["Speed %"] = setRestrictions.speed;
	}
	if (setRestrictions.tenacity) {
		transformedSetRestrictions["Tenacity %"] = setRestrictions.tenacity;
	}
	return transformedSetRestrictions;
};
