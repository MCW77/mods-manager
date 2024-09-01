// react
import type {
	ThunkDispatch,
	ThunkResult,
} from "#/state/reducers/modsOptimizer";

// state
import type { IAppState } from "#/state/storage";
import getDatabase, { type IUserData } from "#/state/storage/Database";
import { beginBatch, endBatch } from "@legendapp/state";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { templates$ } from "#/modules/templates/state/templates";

// modules
import { actions } from "#/state/actions/app";
import { Storage } from "#/state/modules/storage";

// domain
import type * as C3POMods from "#/modules/profilesManagement/dtos/c3po";
import * as C3POMappers from "#/modules/profilesManagement/mappers/c3po";
import type { Mod } from "#/domain/Mod";
import { PlayerProfile, type IFlatPlayerProfile } from "#/domain/PlayerProfile";
import type { PlayerProfile as LegendPlayerProfile } from "#/modules/profilesManagement/domain/PlayerProfile";

export namespace thunks {
	export function deleteProfile(allycode: string): ThunkResult<void> {
		return (dispatch) => {
			const db = getDatabase();
			optimizationSettings$.deleteProfile(allycode);
			incrementalOptimization$.deleteProfile(allycode);
			db.deleteProfile(
				allycode,
				() => dispatch(Storage.thunks.loadProfiles(null)),
				(error) =>
					dialog$.showFlash(
						"Storage Error",
						`Error deleting your profile: ${error?.message}`,
						"",
						undefined,
						"error",
					),
			);
		};
	}

	export function importC3POProfile(profileJSON: string): ThunkResult<void> {
		return (dispatch) => {
			try {
				const mods: C3POMods.C3POModDTO[] = JSON.parse(profileJSON);
				dispatch(replaceModsForCurrentProfile(mods));
			} catch (e) {
				throw new Error(
					`Unable to process the file. Error message: ${(e as Error).message}`,
				);
			}
		};
	}

	export function replaceModsForCurrentProfile(
		mods: C3POMods.C3POModDTO[],
	): ThunkResult<Promise<void>> {
		return async (dispatch, getState) => {
			const db = getDatabase();
			let profile = await db.getProfile(
				profilesManagement$.profiles.activeAllycode.get(),
			);
			const unequippedMods = mods.filter((mod) => mod.equippedUnit === "none");
			const mapper = new C3POMappers.ModMapper();
			const newMods: Mod[] = unequippedMods
				.map((mod) => mapper.fromC3PO(mod))
				.concat(profile.mods.filter((mod) => mod.characterID !== "null"));

			profile = profile.withMods(newMods);
			const totalMods = unequippedMods.length;

			db.saveProfile(
				profile,
				() => {
					dispatch(
						Storage.thunks.loadProfile(
							profilesManagement$.profiles.activeAllycode.get(),
						),
					);
					dialog$.showFlash(
						<p>
							Successfully imported <span className={"gold"}>{totalMods}</span>{" "}
							mods for player{" "}
							<span className={"gold"}>{profilesManagement$.activeProfile.playerName.peek()}</span>
						</p>,
						"",
						"",
						undefined,
						"success",
					);
				},
				(error) =>
					dialog$.showError(`Error saving player profiles: ${error?.message}`),
			);
		};
	}

	export function reset(): ThunkResult<void> {
		return (dispatch) => {
			const db = getDatabase();
			db.delete(
				() => dispatch(actions.resetState()),
				(error) =>
					dialog$.showError(
						`Error deleting the database: ${error?.message}. Try clearing it manually and refreshing.`,
					),
			);
		};
	}

	export function restoreProgress(progressData: string): ThunkResult<void> {
		return (dispatch) => {
			try {
				const stateObj: IUserData = JSON.parse(progressData);

				if (stateObj.version > "1.4" && stateObj.version !== "develop") {
					const profiles: PlayerProfile[] = stateObj.profiles.map(
						(profile: IFlatPlayerProfile) => PlayerProfile.deserialize(profile),
					);
					dispatch(Storage.thunks.saveProfiles(profiles, stateObj.allycode));
					dispatch(Storage.thunks.saveLastRuns(stateObj.lastRuns));
					if (stateObj.characterTemplates) {
						templates$.userTemplatesByName.set(templates$.groupTemplatesById(stateObj.characterTemplates));
					}
					if (stateObj.allycode !== "") {
						dispatch(Storage.thunks.loadProfile(stateObj.allycode));
					}
				}
			} catch (e) {
				throw new Error(
					`Unable to process progress file. Is this a template file? If so, use the "load" button below. Error message: ${
						(e as Error).message
					}`,
				);
			}
		};
	}

	type UpdateFunc = (a: PlayerProfile) => PlayerProfile;
	type AuxiliaryChangesFunc = (
		dispatch: ThunkDispatch,
		getState: () => IAppState,
		c: PlayerProfile,
	) => void;

	function noop(a: unknown, b: unknown, c: unknown) {}

	/**
	 * Update the currently-selected character profile by calling an update function on the existing profile. Optionally
	 * update the base state with other auxiliary changes as well.
	 * @param updateFunc {function(PlayerProfile): PlayerProfile}
	 * @param auxiliaryChanges {function(dispatch, getState, newProfile)} Any additional changes that need to be made in
	 * addition to the profile
	 * @returns {Function}
	 */
	export function updateProfile(
		updateFunc: UpdateFunc,
		auxiliaryChanges: AuxiliaryChangesFunc = noop,
	): ThunkResult<void> {
		return (dispatch, getState: () => IAppState) => {
			const state = getState();
			const db = getDatabase();
			const newProfile = updateFunc(state.profile);

			db.saveProfile(
				newProfile,
				() => {},
				(error) =>
					dialog$.showFlash(
						"Storage Error",
						`Error saving your progress: ${error?.message} Your progress may be lost on page refresh.`,
						"",
						undefined,
						"error",
					),
			);
			dispatch(Storage.actions.setProfile(newProfile));
			profilesManagement$.profiles.activeAllycode.set(newProfile.allycode);
			auxiliaryChanges(dispatch, getState, newProfile);
		};
	}
}
