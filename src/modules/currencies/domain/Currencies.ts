interface Currency {
	id: string;
	quantity: number;
}

type CurrencyById = Map<string, Currency>;

interface CurrencyByIdForProfile {
	id: string;
	currencyById: CurrencyById;
}

type CurrenciesPersistedData = Record<string, CurrencyByIdForProfile>;

export type {
	CurrencyById,
	CurrenciesPersistedData,
	Currency,
	CurrencyByIdForProfile,
};
