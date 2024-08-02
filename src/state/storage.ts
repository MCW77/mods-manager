// domain
import { PlayerProfile } from "../domain/PlayerProfile";
import type { TargetStats } from "../domain/TargetStat";

export interface IAppState {
	profile: PlayerProfile; // All the data about the current character
	targetStats: TargetStats;
}

export class AppState {
	static readonly keysToSave = [] as const;

	static readonly Default: IAppState = {
		profile: PlayerProfile.Default, // All the data about the current character
		targetStats: [] as TargetStats,
	};

	/**
	 * Save the state of the application to localStorage, then return it so it can be chained
	 * @param state {IAppState}
	 * @returns {IAppState}
	 */
	static save(state: IAppState) {
		return state;
	}
}
