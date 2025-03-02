import type { ObservablePrimitive } from "@legendapp/state";

interface AboutObservable {
	persistedData: {
		id: "version";
		version: string;
	};
	version: () => ObservablePrimitive<string>;
	checkVersion: () => void;
}

export type { AboutObservable };
