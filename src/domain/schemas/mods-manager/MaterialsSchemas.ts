// utils
import * as v from "valibot";

const MaterialSchemaV24 = v.object({
	bonusQuantity: v.number(),
	id: v.string(),
	quantity: v.number(),
});

const MaterialByIdForProfileSchemaV24 = v.object({
	id: v.string(),
	materialById: v.map(v.string(), MaterialSchemaV24),
});

const MaterialsSchemaV24 = v.record(
	v.string(),
	MaterialByIdForProfileSchemaV24,
);

export { MaterialsSchemaV24 };
