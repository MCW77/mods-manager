// domain
import type { BaseCharactersById } from "../domain/BaseCharacter";
import type { OptimizationStatus } from "../domain/OptimizationStatus";
import { PlayerProfile } from "../domain/PlayerProfile";
import type { TargetStats } from "../domain/TargetStat";

export interface IAppState {
	baseCharacters: BaseCharactersById;
	profile: PlayerProfile; // All the data about the current character
	progress: OptimizationStatus;
	targetStats: TargetStats;
}

export class AppState {
	static readonly keysToSave = [] as const;

	static readonly Default: IAppState = {
		baseCharacters: {} as BaseCharactersById,
		profile: PlayerProfile.Default, // All the data about the current character
		progress: {
			character: null,
			progress: 0,
			step: "1",
		},
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
