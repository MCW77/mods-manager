// utils
import * as v from "valibot";

const CurrencySchemaV24 = v.object({
	id: v.string(),
	quantity: v.number(),
});

const CurrencyByIdForProfileSchemaV24 = v.object({
	id: v.string(),
	currencyById: v.map(v.string(), CurrencySchemaV24),
});

const CurrenciesSchemaV24 = v.record(
	v.string(),
	CurrencyByIdForProfileSchemaV24,
);

export { CurrenciesSchemaV24 };
