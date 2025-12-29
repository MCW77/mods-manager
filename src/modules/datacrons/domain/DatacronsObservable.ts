import type { Observable } from "@legendapp/state";
import type { DatacronsById, DatacronsPersistedData } from "./Datacrons";

interface DatacronsObservable {
	persistedData: DatacronsPersistedData;
	datacronsById: () => Observable<DatacronsById>;
	reset: () => void;
}

const getInitialDatacrons = (): DatacronsPersistedData => {
	const datacrons: DatacronsPersistedData = {
		datacrons: {
			id: "datacrons",
			datacronsById: new Map(),
		},
	};
	return datacrons;
};

export { type DatacronsObservable, getInitialDatacrons };
