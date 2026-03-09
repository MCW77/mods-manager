// utils
import * as v from "valibot";

// domain
import { allowedPrimaryStatsBySlot } from "#/domain/GIMOStatNames";
import { TargetStatsSchema } from "./TargetStatsSchemas";

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

const PrimaryStatRestrictionsSchema = v.object({
	arrow: v.optional(v.picklist(allowedPrimaryStatsBySlot.arrow)),
	triangle: v.optional(v.picklist(allowedPrimaryStatsBySlot.triangle)),
	circle: v.optional(v.picklist(allowedPrimaryStatsBySlot.circle)),
	cross: v.optional(v.picklist(allowedPrimaryStatsBySlot.cross)),
});

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
