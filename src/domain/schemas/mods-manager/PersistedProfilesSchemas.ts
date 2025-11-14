// utils
import * as v from "valibot";

// domain
import { CharacterByIdSchema, ArbitraryCharacterNamesSchema } from "./index.js";
import { setSettingsSets } from "#/modules/modsView/domain/ModsViewOptions.js";
import { gimoSlots, levels } from "#/domain/types/ModTypes.js";
import { ModTiersEnum } from "#/constants/enums.js";
import {
	gimoPrimaryStatNames,
	gimoSecondaryStatNames,
} from "#/domain/GIMOStatNames.js";
import { strRolls } from "#/domain/SecondaryStat.js";
import { pips } from "#/domain/Pips.js";

const GIMOFlatModSchema = v.object({
	mod_uid: v.string(),
	primaryBonusType: v.picklist(gimoPrimaryStatNames),
	primaryBonusValue: v.string(),

	secondaryType_1: v.nullable(v.picklist(gimoSecondaryStatNames)),
	secondaryValue_1: v.string(),
	secondaryRoll_1: v.nullable(v.picklist(strRolls)),
	secondaryType_2: v.nullable(v.picklist(gimoSecondaryStatNames)),
	secondaryValue_2: v.string(),
	secondaryRoll_2: v.nullable(v.picklist(strRolls)),
	secondaryType_3: v.nullable(v.picklist(gimoSecondaryStatNames)),
	secondaryValue_3: v.string(),
	secondaryRoll_3: v.nullable(v.picklist(strRolls)),
	secondaryType_4: v.nullable(v.picklist(gimoSecondaryStatNames)),
	secondaryValue_4: v.string(),
	secondaryRoll_4: v.nullable(v.picklist(strRolls)),

	slot: v.picklist(gimoSlots),
	set: v.picklist(setSettingsSets),
	level: v.picklist(levels),
	pips: v.picklist(pips),
	tier: v.enum(ModTiersEnum),
	characterID: v.union([v.literal("null"), ArbitraryCharacterNamesSchema]),
	reRolledCount: v.number(),
});

const PersistedPlayerProfileSchemaV18 = v.object({
	allycode: v.string(),
	characterById: CharacterByIdSchema,
	modById: v.record(v.string(), GIMOFlatModSchema),
	playerName: v.string(),
});

const PersistedPlayerProfileSchemaV21 = v.object({
	allycode: v.string(),
	characterById: CharacterByIdSchema,
	modById: v.map(v.string(), GIMOFlatModSchema),
	playerName: v.string(),
});

const PersistedProfilesSchemaV18 = v.object({
	activeAllycode: v.string(),
	lastUpdatedByAllycode: v.record(
		v.string(),
		v.object({
			id: v.string(),
			lastUpdated: v.number(),
		}),
	),
	playernameByAllycode: v.record(v.string(), v.string()),
	profileByAllycode: v.record(v.string(), PersistedPlayerProfileSchemaV18),
});

const PersistedProfilesSchemaV21 = v.object({
	activeAllycode: v.string(),
	lastUpdatedByAllycode: v.record(
		v.string(),
		v.object({
			id: v.string(),
			lastUpdated: v.number(),
		}),
	),
	playernameByAllycode: v.record(v.string(), v.string()),
	profileByAllycode: v.record(v.string(), PersistedPlayerProfileSchemaV21),
});

type PersistedProfilesSchemaOutput = v.InferOutput<
	typeof PersistedProfilesSchemaV21
>;

export {
	PersistedProfilesSchemaV18,
	PersistedProfilesSchemaV21,
	type PersistedProfilesSchemaOutput,
};
