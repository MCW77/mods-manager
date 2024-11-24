type IndicesByProfile = Record<string, number | null>;

interface IncrementalOptimizationObservable {
	activeIndex: () => number | null;
	indicesByProfile: IndicesByProfile;
	addProfile: (allycode: string) => void;
	reset: () => void;
	deleteProfile: (allycode: string) => void;
}

export type { IncrementalOptimizationObservable, IndicesByProfile };
