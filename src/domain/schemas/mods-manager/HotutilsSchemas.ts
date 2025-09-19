// utils
import * as v from "valibot";

const HotutilsSchemaV18 = v.record(v.string(), v.string());
const HotutilsSchemaV21 = v.map(
	v.string(),
	v.object({
		gimoSessionId: v.string(),
		huSessionId: v.string(),
	}),
);

export { HotutilsSchemaV18, HotutilsSchemaV21 };
