// state
import { type ObservableObject, observable } from "@legendapp/state";

// domain
import type { OptimizationStatus } from "../domain/OptimizationStatus";

interface Progress {
	optimizationStatus: OptimizationStatus;
}

const progress$: ObservableObject<Progress> = observable<Progress>({
	optimizationStatus: {
    character: "",
		characterCount: 0,
		characterIndex: 0,
    progress: 0,
    message: "",
  },
});

export { progress$ };
