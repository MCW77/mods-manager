// utils
import * as v from "valibot";

// domain
import { CharacterByIdSchemaV23 } from "./index";

const PersistedRosterSchemaV27 = v.record(
	v.string(),
	v.object({
		id: v.string(),
		characterById: CharacterByIdSchemaV23,
	}),
);

export { PersistedRosterSchemaV27 };
