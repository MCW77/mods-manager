// utils
import * as v from "valibot";

// domain
import { variablePrimarySlots } from "#/domain/types/ModTypes.js";
import { gimoPrimaryStatNames } from "#/domain/GIMOStatNames.js";
import { TargetStatsSchema } from "./TargetStatsSchemas.js";

const gimoSetStatNames = [
	"critchance",
	"critdamage",
	"defense",
	"health",
	"offense",
	"potency",
	"speed",
	"tenacity",
] as const;

const VariablePrimarySlotSchema = v.picklist(variablePrimarySlots);
const GIMOPrimaryStatNamesSchema = v.picklist(gimoPrimaryStatNames);
const PrimaryStatRestrictionsSchema = v.record(
	VariablePrimarySlotSchema,
	GIMOPrimaryStatNamesSchema,
);

const GIMOSetStatNamesSchema = v.picklist(gimoSetStatNames);
const SetRestrictionsSchema = v.record(GIMOSetStatNamesSchema, v.number());

const OptimizationPlanSchema = v.object({
	name: v.string(),
	health: v.number(),
	protection: v.number(),
	speed: v.number(),
	critDmg: v.number(),
	potency: v.number(),
	tenacity: v.number(),
	physDmg: v.number(),
	specDmg: v.number(),
	critChance: v.number(),
	armor: v.number(),
	resistance: v.number(),
	accuracy: v.number(),
	critAvoid: v.number(),
	targetStats: TargetStatsSchema,
	upgradeMods: v.boolean(),
	primaryStatRestrictions: PrimaryStatRestrictionsSchema,
	setRestrictions: SetRestrictionsSchema,
	useOnlyFullSets: v.boolean(),
});

export { OptimizationPlanSchema, SetRestrictionsSchema };
