// utils
import * as v from "valibot";

// domain
import {
	calibrationSettingsCalibrationPrices,
	levelSettingsStringLevels,
	primarySettingsPrimaries,
	raritySettingsRarities,
	secondarySettingsSecondaries,
	setSettingsSets,
	slotSettingsSlots,
	tierSettingsTiers,
} from "#/modules/modsView/domain/ModsViewOptions";
import { categories } from "#/modules/modsView/domain/Categories";

const TriStateSchema = v.picklist([-1, 0, 1]);
const CalibrationSettingsSchema = v.optional(
	v.object(
		v.entriesFromList(calibrationSettingsCalibrationPrices, TriStateSchema),
	),
	{
		"15": 0,
		"25": 0,
		"40": 0,
		"75": 0,
		"100": 0,
		"150": 0,
	},
);
const AssignedSettingsSchema = v.object({ assigned: TriStateSchema });
const EquippedSettingsSchema = v.object({ equipped: TriStateSchema });
const LevelSettingsSchema = v.object(
	v.entriesFromList(levelSettingsStringLevels, TriStateSchema),
);
const PrimarySettingsSchema = v.object(
	v.entriesFromList(primarySettingsPrimaries, TriStateSchema),
);
const RaritySettingsSchema = v.object(
	v.entriesFromList(raritySettingsRarities, TriStateSchema),
);
const SecondarySettingsSchema = v.object(
	v.entriesFromList(secondarySettingsSecondaries, TriStateSchema),
);

const SlotSettingsSchema = v.object(
	v.entriesFromList(slotSettingsSlots, TriStateSchema),
);
const SetSettingsSchema = v.object(
	v.entriesFromList(setSettingsSets, TriStateSchema),
);
const TierSettingsSchema = v.object(
	v.entriesFromList(tierSettingsTiers, TriStateSchema),
);
const FilterSchema = v.object({
	assigned: AssignedSettingsSchema,
	calibration: CalibrationSettingsSchema,
	id: v.string(),
	equipped: EquippedSettingsSchema,
	level: LevelSettingsSchema,
	modset: SetSettingsSchema,
	primary: PrimarySettingsSchema,
	rarity: RaritySettingsSchema,
	score: v.optional(
		v.tuple([
			v.pipe(v.number(), v.minValue(0), v.maxValue(800)),
			v.pipe(v.number(), v.minValue(0), v.maxValue(800)),
		]),
		[0, 100],
	),
	secondary: SecondarySettingsSchema,
	slot: SlotSettingsSchema,
	speedRange: v.optional(
		v.tuple([
			v.pipe(v.number(), v.minValue(0), v.maxValue(31)),
			v.pipe(v.number(), v.minValue(0), v.maxValue(31)),
		]),
		[0, 31],
	),
	tier: TierSettingsSchema,
});

const PersistableSortConfigByIdSchema = v.record(
	v.string(),
	v.object({
		id: v.string(),
		sortBy: v.string(),
		sortOrder: v.literal("asc", "desc"),
	}),
);

const PersistableViewSetupSchema = v.object({
	category: v.picklist(categories),
	description: v.string(),
	filterById: v.record(v.string(), FilterSchema),
	id: v.string(),
	isGroupingEnabled: v.boolean(),
	modScore: v.string(),
	sort: PersistableSortConfigByIdSchema,
});

const ModsViewSetupsSchema = v.object(
	v.entriesFromList(
		categories,
		v.record(v.string(), PersistableViewSetupSchema),
	),
);

export { ModsViewSetupsSchema };
