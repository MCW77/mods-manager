// utils
import * as v from "valibot";

// domain
import {
	CharacterByIdSchemaV26,
	CharacterByIdSchemaV30,
	CharacterByIdSchemaV31,
} from "./index";

const PersistedRosterSchemaV27 = v.record(
	v.string(),
	v.object({
		id: v.string(),
		characterById: CharacterByIdSchemaV26,
	}),
);

const PersistedRosterSchemaV30 = v.record(
	v.string(),
	v.object({
		id: v.string(),
		characterById: CharacterByIdSchemaV30,
	}),
);

const PersistedRosterSchemaV31 = v.record(
	v.string(),
	v.object({
		id: v.string(),
		characterById: CharacterByIdSchemaV31,
	}),
);

export {
	PersistedRosterSchemaV27,
	PersistedRosterSchemaV30,
	PersistedRosterSchemaV31,
};
