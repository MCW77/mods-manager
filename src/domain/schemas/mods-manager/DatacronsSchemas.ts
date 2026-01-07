// utils
import * as v from "valibot";

// domain
import { type StatId, statIds } from "#/modules/hotUtils/domain/StatIDs";

const AffixSchemaV24 = v.object({
	abilityId: v.string(),
	requiredRelicTier: v.number(),
	requiredUnitTier: v.number(),
	scopeIcon: v.string(),
	statType: v.pipe(
		v.number(),
		v.check((input) => (Object.values(statIds) as number[]).includes(input)),
		v.transform((input) => input as StatId),
	),
	statValue: v.number(),
	tag: v.array(v.string()),
	targetRule: v.string(),
});

const DatacronSchemaV24 = v.object({
	affix: v.array(AffixSchemaV24),
	id: v.string(),
	focused: v.boolean(),
	locked: v.boolean(),
	name: v.string(),
	rerollCount: v.number(),
	rerollIndex: v.number(),
	rerollOption: v.array(AffixSchemaV24),
	setId: v.number(),
	tag: v.array(v.string()),
	templateId: v.string(),
});

const DatacronByIdForProfileSchemaV24 = v.object({
	id: v.string(),
	datacronById: v.map(v.string(), DatacronSchemaV24),
});

const DatacronsSchemaV24 = v.record(
	v.string(),
	DatacronByIdForProfileSchemaV24,
);

export { DatacronsSchemaV24 };
