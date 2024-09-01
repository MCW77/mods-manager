// state
import { defaultAppState } from "../storage";

export namespace reducers {
	export function resetState() {
		return Object.assign({}, structuredClone(defaultAppState));
	}
}


