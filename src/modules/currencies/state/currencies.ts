// state
import { observable, type ObservableObject } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import {
	getInitialCurrencies,
	type CurrenciesObservable,
} from "../domain/CurrenciesObservable";
import type { CurrencyById, Currency } from "../domain/Currencies";

const currencies$: ObservableObject<CurrenciesObservable> =
	observable<CurrenciesObservable>({
		persistedData: getInitialCurrencies(),
		currencyByIdByAllycode: () => {
			return currencies$.persistedData;
		},
		currencyByIdForActiveAllycode: () => {
			const allycode = profilesManagement$.activeProfile.allycode.get();
			return (
				currencies$.currencyByIdByAllycode[allycode]?.currencyById ??
				observable(new Map<string, Currency>() as CurrencyById)
			);
		},
		addProfile: (allycode: string) => {
			if (Object.hasOwn(currencies$.currencyByIdByAllycode, allycode)) return;
			currencies$.currencyByIdByAllycode[allycode].set({
				id: allycode,
				currencyById: new Map<string, Currency>(),
			});
		},
		deleteProfile: (allycode: string) => {
			if (!Object.hasOwn(currencies$.currencyByIdByAllycode, allycode)) return;
			currencies$.currencyByIdByAllycode.allycode.delete();
		},
		reset: () => {
			syncStatus$.reset();
		},
	});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	currencies$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		currencies$.currencyByIdByAllycode.set({});
		return;
	}
	currencies$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	currencies$.persistedData,
	persistOptions({
		persist: {
			name: "Currencies",
		},
		initial: getInitialCurrencies(),
	}),
);

export { currencies$, syncStatus$ };
