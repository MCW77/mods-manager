// state
import type { IAppState } from "../storage";

export namespace selectors {
	export const selectBaseCharacters = (state: IAppState) =>
		state.baseCharacters;
}
