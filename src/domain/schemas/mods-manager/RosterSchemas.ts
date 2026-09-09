// utils
import * as v from "valibot";

// domain
import { CharacterByIdSchemaV26, CharacterByIdSchemaV30 } from "./index";

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

export { PersistedRosterSchemaV27, PersistedRosterSchemaV30 };
