import type { Observable } from "@legendapp/state";

type IndicesByProfile = Record<string, number | null>;

interface IncrementalOptimizationObservable {
	persistedData: {
		id: "indicesByProfile";
		indicesByProfile: IndicesByProfile;
	};
	indicesByProfile: () => Observable<IndicesByProfile>;
	activeIndex: () => number | null;
	addProfile: (allycode: string) => void;
	reset: () => void;
	deleteProfile: (allycode: string) => void;
}

export type { IncrementalOptimizationObservable, IndicesByProfile };
