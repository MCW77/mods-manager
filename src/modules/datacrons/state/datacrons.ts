// state
import { observable, type ObservableObject } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

// domain

import {
	getInitialDatacrons,
	type DatacronsObservable,
} from "../domain/DatacronsObservable";

const datacrons$: ObservableObject<DatacronsObservable> =
	observable<DatacronsObservable>({
		persistedData: getInitialDatacrons(),
		datacronsById: () => {
			return datacrons$.persistedData.datacrons.datacronsById;
		},
		reset: () => {
			syncStatus$.reset();
		},
	});

const syncStatus$ = syncObservable(
	datacrons$.persistedData,
	persistOptions({
		persist: {
			name: "Datacrons",
		},
		initial: getInitialDatacrons(),
	}),
);

export { datacrons$, syncStatus$ };
