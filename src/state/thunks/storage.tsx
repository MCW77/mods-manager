// react
import type { ThunkResult } from "#/state/reducers/modsOptimizer";

// utils
import nothing from "#/utils/nothing";

// state
import getDatabase, { type IUserData } from "#/state/storage/Database";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// actions
import { actions } from "#/state/actions/storage";

// modules
import { App } from "#/state/modules/app";

// domain
import type { Mod } from "#/domain/Mod";
import type { OptimizerRun } from "#/domain/OptimizerRun";
import { PlayerProfile } from "#/domain/PlayerProfile";
import type { PlayerProfile as LegendPlayerProfile } from "#/modules/profilesManagement/domain/PlayerProfile";

export namespace thunks {

	/**
	 * Remove a mod from a player's profile
	 * @param mod {Mod}
	 * @returns {Function}
	 */
	export function deleteMod(mod: Mod) {
		return App.thunks.updateProfile(
			(profile) => {
				const oldMods = profile.mods;

				return profile.withMods(oldMods.filter((oldMod) => oldMod !== mod));
			},
			(dispatch, getState) => {
				const profile = getState().profile;
				const db = getDatabase();

				db.deleteLastRun(profile.allycode, nothing, (error) =>
					dialog$.showFlash(
						"Storage Error",
						`Error updating your saved results: ${error?.message}. The optimizer may not recalculate correctly until you fetch data again`,
						"",
						undefined,
						"error",
					),
				);
			},
		);
	}

	/**
	 * Remove a set of mods from a player's profile
	 * @param mods {Array<Mod>}
	 * @returns {Function}
	 */
	export function deleteMods(mods: Mod[]) {
		return App.thunks.updateProfile(
			(profile) => {
				const oldMods = profile.mods;

				return profile.withMods(
					oldMods.filter((oldMod) => !mods.includes(oldMod)),
				);
			},
			(dispatch, getState) => {
				const profile = getState().profile;
				const db = getDatabase();

				db.deleteLastRun(profile.allycode, nothing, (error) =>
					dialog$.showFlash(
						"Storage Error",
						`Error updating your saved results: ${error?.message}. The optimizer may not recalculate correctly until you fetch data again`,
						"",
						undefined,
						"error",
					),
				);
			},
		);
	}

	/**
	 * Export all of the data in the database
	 * @param callback {function(Object)}
	 * @returns {Function}
	 */
	export function exportDatabase(
		callback: (ud: IUserData) => void,
	): ThunkResult<void> {
		return (dispatch) => {
			const db = getDatabase();
			db.export(callback, (error) =>
				dialog$.showError(
					`Error fetching data from the database: ${error?.message}`,
				),
			);
		};
	}

	/**
	 * Load a single player profile from the database and set it in the state
	 * @param allycode {string}
	 * @returns {*}
	 */
	export function loadProfile(allycode: string): ThunkResult<Promise<void>> {
		return async (dispatch) => {
			try {
				const db = getDatabase();
				const profile: PlayerProfile = await db.getProfile(allycode);
				profilesManagement$.ensureSelectedCharactersExistInProfile(allycode);
				dispatch(actions.setProfile(profile));
				profilesManagement$.profiles.activeAllycode.set(allycode);
				hotutils$.checkSubscriptionStatus();
			} catch (error) {
				dialog$.showError(
					`Error loading your profile from the database: ${
						(error as DOMException).message
					}`,
				);
			}
		};
	}
/*
	export function loadProfile(allycode: string): ThunkResult<Promise<void>> {
		return async (dispatch) => {
			try {
				const db = getDatabase();
				const profile: PlayerProfile = await db.getProfile(allycode);
				selectedCharacters$.filterUnfetchedCharacters(profile);

				if (profile.allycode)
					profilesManagement$.profiles.activeAllycode.set(profile.allycode);
				dispatch(actions.setProfile(profile));
				profilesManagement$.profiles.activeAllycode.set(allycode);
				hotutils$.checkSubscriptionStatus();
			} catch (error) {
				dialog$.showError(
					`Error loading your profile from the database: ${
						(error as DOMException).message
					}`,
				);
			}
		};
	}
*/

	/**
	 * Load profiles from the database and store them in the state. Only keep the full profile for the current active
	 * ally code. All others only keep the ally code and name
	 * @param allycode
	 * @returns {Function}
	 */
	export function loadProfiles(allycode: string | null): ThunkResult<void> {
		return (dispatch, getState) => {
			const db = getDatabase();

			try {
				// Clean up profiles to make sure that every selected character actually exists in the profile
				profilesManagement$.ensureSelectedCharactersExist();
				db.getProfiles(
					(profiles: PlayerProfile[]) => {

						// Set the active profile
						const profile = allycode
							? profiles.find((profile) => profile.allycode === allycode)
							: profiles.find((profile, index) => index === 0);

						dispatch(actions.setProfile(profile ?? PlayerProfile.Default));
						profilesManagement$.profiles.activeAllycode.set(
							profile?.allycode ?? "",
						);
						if (profile !== undefined) {
							hotutils$.checkSubscriptionStatus();
						} else if (profilesManagement$.hasProfiles.get()) {
							dispatch(App.actions.resetState());
						}
					},
					(error) =>
						dialog$.showFlash(
							"Storage Error",
							`Error retrieving profiles: ${error?.message}`,
							"",
							undefined,
							"error",
						),
				);
			} catch (e) {
				dialog$.showError([
					<p key={1}>
						Unable to load database: {(e as Error).message} Please fix the
						problem and try again, or ask for help in the discord server below.
					</p>,
				]);
			}
		};
	}

	/**
	 * Add new Optimizer Runs to the database, or update existing ones.
	 * @param lastRuns {Array<OptimizerRun>}
	 * @returns {Function}
	 */
	export function saveLastRuns(lastRuns: OptimizerRun[]): ThunkResult<void> {
		return (dispatch) => {
			const db = getDatabase();
			db.saveLastRuns(lastRuns, (error) =>
				dialog$.showError(
					`Error saving previous runs: ${error?.message} The optimizer may not recalculate all toons properly until you fetch data again.`,
				),
			);
		};
	}

	/**
	 * Add new Profiles to the database, or update existing ones.
	 * @param profiles {Array<PlayerProfile>}
	 * @param allycode {string}
	 * @returns {Function}
	 */
	export function saveProfiles(
		profiles: PlayerProfile[],
		allycode: string,
	): ThunkResult<void> {
		return (dispatch) => {
			const db = getDatabase();
			db.saveProfiles(
				profiles,
				() => dispatch(loadProfiles(allycode)),
				(error) =>
					dialog$.showError(`Error saving player profiles: ${error?.message}`),
			);
		};
	}
}
