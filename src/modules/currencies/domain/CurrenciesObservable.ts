// state
import type { Observable } from "@legendapp/state";

// domain
import type {
	CurrencyById,
	CurrenciesPersistedData,
	CurrencyByIdForProfile,
} from "./Currencies";

interface CurrenciesObservable {
	persistedData: CurrenciesPersistedData;
	currencyByIdByAllycode: () => Observable<
		Record<string, CurrencyByIdForProfile>
	>;
	currencyByIdForActiveAllycode: () => Observable<CurrencyById>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
}

const getInitialCurrencies = (): CurrenciesPersistedData => {
	const currencies: CurrenciesPersistedData = {};
	return currencies;
};

export { type CurrenciesObservable, getInitialCurrencies };
