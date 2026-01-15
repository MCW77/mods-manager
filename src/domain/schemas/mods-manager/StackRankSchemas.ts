// utils
import * as v from "valibot";

const StackRankParametersSchemaV25 = v.object({
	alignmentFilter: v.union([
		v.literal("0"),
		v.literal("1"),
		v.literal("2"),
		v.literal("3"),
	]),
	ignoreArena: v.boolean(),
	minimumGearLevel: v.number(),
	top: v.optional(v.number()),
	omicronGac: v.boolean(),
	omicronTw: v.boolean(),
	omicronTb: v.boolean(),
	omicronRaids: v.boolean(),
	omicronConquest: v.boolean(),
});

const StackRankSettingsSchemaV25 = v.object({
	useCase: v.union([
		v.literal("0"),
		v.literal("1"),
		v.literal("2"),
		v.literal("3"),
	]),
	parameters: StackRankParametersSchemaV25,
});

const StackRankSettingsForProfileSchemaV25 = v.object({
	id: v.string(),
	stackRankSettings: StackRankSettingsSchemaV25,
});

const StackRankSchemaV25 = v.record(
	v.string(),
	StackRankSettingsForProfileSchemaV25,
);

export { StackRankSchemaV25 };
