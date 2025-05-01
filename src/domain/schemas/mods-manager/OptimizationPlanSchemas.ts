// utils
import * as v from "valibot";

// domain
import { variablePrimarySlots } from "#/domain/types/ModTypes";
import { gimoPrimaryStatNames, gimoSetStatNames } from "#/domain/GIMOStatNames";
import { TargetStatsSchema } from "./";

const VariablePrimarySlotSchema = v.picklist(variablePrimarySlots);
const GIMOPrimaryStatNamesSchema = v.picklist(gimoPrimaryStatNames);
const PrimaryStatRestrictionsSchema = v.record(
	VariablePrimarySlotSchema,
	GIMOPrimaryStatNamesSchema,
);

const GIMOSetStatNamesSchema = v.picklist(gimoSetStatNames);
const SetRestrictionsSchema = v.record(GIMOSetStatNamesSchema, v.number());

const OptimizationPlanSchema = v.object({
	id: v.string(),
	description: v.string(),
	Health: v.number(),
	Protection: v.number(),
	Speed: v.number(),
	"Critical Damage %": v.number(),
	"Potency %": v.number(),
	"Tenacity %": v.number(),
	"Physical Damage": v.number(),
	"Special Damage": v.number(),
	"Critical Chance": v.number(),
	Armor: v.number(),
	Resistance: v.number(),
	"Accuracy %": v.number(),
	"Critical Avoidance %": v.number(),
	targetStats: TargetStatsSchema,
	minimumModDots: v.number(),
	primaryStatRestrictions: PrimaryStatRestrictionsSchema,
	setRestrictions: SetRestrictionsSchema,
	useOnlyFullSets: v.boolean(),
});

export { OptimizationPlanSchema };
