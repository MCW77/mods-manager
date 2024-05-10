// utils
import { mapValues } from "lodash-es";
import { pick } from "../utils/mapObject";
import type { ElementType } from "../utils/typeHelper";

// domain
import type { BaseCharactersById } from "../domain/BaseCharacter";
import {
	type ModsViewOptions,
	defaultOptions,
} from "../domain/modules/ModsViewOptions";
import type { OptimizationStatus } from "../domain/OptimizationStatus";
import { PlayerProfile } from "../domain/PlayerProfile";
import type { TargetStats } from "../domain/TargetStat";
import type { Templates } from "../domain/Templates";

export interface IAppState {
	baseCharacters: BaseCharactersById;
	modsViewOptions: ModsViewOptions;
	profile: PlayerProfile; // All the data about the current character
	progress: OptimizationStatus;
	showSidebar: boolean;
	targetStats: TargetStats;
	templates: Templates;
}

export class AppState {
	static readonly keysToSave = [
		"modsViewOptions",
		"showSidebar",
		"templates",
	] as const;

	static readonly Default: IAppState = {
		baseCharacters: {} as BaseCharactersById,
		modsViewOptions: defaultOptions,
		profile: PlayerProfile.Default, // All the data about the current character
		progress: {
			character: null,
			progress: 0,
			step: "1",
		},
		showSidebar: true,
		targetStats: [] as TargetStats,
		templates: {
			templatesAddingMode: "replace",
			userTemplatesByName: {},
		},
	};

	/**
	 * Save the state of the application to localStorage, then return it so it can be chained
	 * @param state {IAppState}
	 * @returns {IAppState}
	 */
	static save(state: IAppState) {
		const reducedState: Pick<
			IAppState,
			ElementType<typeof AppState.keysToSave>
		> = pick(state, ...AppState.keysToSave);
		const storedState = AppState.serialize(reducedState);
		window.localStorage.setItem("optimizer.state", JSON.stringify(storedState));
		return state;
	}

	/**
	 * Restore the application from localStorage
	 * @returns {IAppState}
	 */
	static restore(): IAppState {
		let state: string | null = null;

		try {
			state = window.localStorage.getItem("optimizer.state");
		} catch {
			return AppState.Default;
		}
		return state ? deserializeState(JSON.parse(state)) : AppState.Default;
	}

	/**
	 * Convert the state from an in-memory representation to a serialized representation
	 * @param state {object}
	 */
	static serialize(state: any): any {
		if (null === state || "undefined" === typeof state) {
			return null;
		}
		if ("function" === typeof state.serialize) {
			return state.serialize();
		}
		if (Array.isArray(state)) {
			return state.map((item) => AppState.serialize(item));
		}
		if (state instanceof Object) {
			return mapValues(state, (stateValue: any) =>
				AppState.serialize(stateValue),
			);
		}
		return state;
	}
}

/**
 * Convert the state from a serialized representation to the in-memory representation used by the app
 * @param state {IAppState}
 */
export function deserializeState(state: IAppState): IAppState {
	return Object.assign({}, AppState.Default, {
		modsViewOptions: Object.assign(
			{},
			AppState.Default.modsViewOptions,
			state.modsViewOptions,
		),
		showSidebar:
			"undefined" !== typeof state.showSidebar
				? state.showSidebar
				: AppState.Default.showSidebar,
		templates: state.templates,
	});
}
