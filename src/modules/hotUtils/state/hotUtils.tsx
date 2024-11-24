// react
import { lazy } from "react";

// state
import {
	beginBatch,
	endBatch,
	observable,
	type ObservableObject,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
import { dialog$ } from "#/modules/dialog/state/dialog";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";

// domain
import type { FetchedGIMOProfile } from "../domain/FetchedGIMOProfile";
import type { FetchedHUProfile } from "../domain/FetchedHUProfile";
import type { Loadout } from "../domain/Loudout";
import type { ProfileCreationData } from "../domain/ProfileCreationData";
import type * as DTOs from "#/modules/profilesManagement/dtos";
import * as Mappers from "#/modules/profilesManagement/mappers";
import type { PlayerValuesByCharacter } from "#/modules/profilesManagement/domain/PlayerValues";
import { Mod } from "#/domain/Mod";
import type {
	HotutilsObservable,
	SessionIdByProfile,
} from "../domain/HotutilsObservable";

// components
import { ModMoveCancelModal } from "../components/ModMoveCancelModal";

const LazyModMoveProgress = lazy(() => import("../components/ModMoveProgress"));

const hotutilsv2baseurl =
	"https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2";
const hotutilsv2mockbaseurl = "http://localhost:3001/humock";

const post = async (url = "", data = {}, extras = {}) => {
	const response = await fetch(
		url,
		Object.assign(
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
				mode: "cors",
			},
			extras,
		) as RequestInit,
	);

	if (response.ok) {
		return response.json();
	}
	return response
		.text()
		.then((errorText) => Promise.reject(new Error(errorText)));
};

const hotutils$: ObservableObject<HotutilsObservable> =
	observable<HotutilsObservable>({
		activeSessionId: () => {
			const allycode = profilesManagement$.profiles.activeAllycode.get();
			return hotutils$.sessionIdByProfile[allycode].get() || "";
		},
		hasActiveSession: () => {
			return hotutils$.activeSessionId.get() !== "" && hotutils$.isSubscribed();
		},
		getSessionIdOfProfile: (allycode: string) => {
			return hotutils$.sessionIdByProfile[allycode].peek() || "";
		},
		isMoving: false,
		isSubscribed: () => hotutils$.checkSubscriptionStatus(),
		moveStatus: {
			taskId: 0,
			progress: {
				index: 0,
				count: 0,
				elapsedMs: 0,
				result: "",
			},
			message: "",
		},
		sessionIdByProfile: {} as SessionIdByProfile,
		addProfile: (allycode: string) => {
			hotutils$.sessionIdByProfile[allycode].set("");
		},
		deleteProfile: (allycode: string) => {
			hotutils$.sessionIdByProfile[allycode].delete();
		},
		reset: () => {
			syncStatus$.reset();
		},
		cancelModMove: async () => {
			isBusy$.set(true);
			try {
				const response = await post(
					"https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
					{
						action: "cancelmove",
						sessionId: hotutils$.activeSessionId.get(),
						payload: {
							taskId: hotutils$.moveStatus.taskId.get(),
						},
					},
				);

				if (response.errorMessage) {
					dialog$.showFlash(
						"Canceling the mod move failed",
						response.errorMessage,
						"",
						undefined,
						"warning",
					);
					return;
				}
				switch (response.responseCode) {
					case 0:
						dialog$.showFlash(
							"Canceling the mod move failed",
							response.responseMessage,
							"",
							undefined,
							"warning",
						);
						break;
					default:
						hotutils$.isMoving.set(false);
						dialog$.show(<ModMoveCancelModal />, true);
				}
			} catch {
				(error: Error) => {
					dialog$.showFlash(
						"Canceling the mod move failed",
						error.message,
						"",
						undefined,
						"warning",
					);
				};
			} finally {
				isBusy$.set(false);
			}
		},
		checkSubscriptionStatus: async (): Promise<boolean> => {
			const activeAllycode = profilesManagement$.profiles.activeAllycode.get();
			if (activeAllycode === "") return false;
			isBusy$.set(true);
			try {
				const response = await post(hotutilsv2baseurl, {
					action: "checksubscription",
					payload: {
						allyCode: activeAllycode,
					},
				});

				if (response.errorMessage) {
					dialog$.showFlash(
						"Error checking subscription status",
						response.errorMessage,
						"",
						undefined,
						"error",
					);
					return false;
				}
				switch (response.access) {
					case 0:
						dialog$.showFlash(
							"HotUtils reports no subscription",
							"",
							"",
							undefined,
							"warning",
						);
						return false;
					case 1:
						dialog$.showFlash(
							"You are subscribed but not connected to HotUtils",
							"",
							"",
							undefined,
							"info",
						);
						return true;
					case 2:
						dialog$.showFlash(
							"You are subscribed and connected to HotUtils",
							"",
							"",
							undefined,
							"info",
						);
						return true;
					default:
						dialog$.showFlash(
							"Unknown response from HotUtils",
							"",
							"",
							undefined,
							"warning",
						);
				}
			} catch {
				(error: Error) => {
					dialog$.showFlash(
						"Error checking subscription status",
						error.message,
						"",
						undefined,
						"error",
					);
				};
			} finally {
				isBusy$.set(false);
			}
			return false;
		},
		createProfile: async (profile: ProfileCreationData) => {
			isBusy$.set(true);
			try {
				const response = await post(hotutilsv2baseurl, {
					action: "createprofile",
					sessionId: hotutils$.activeSessionId.get(),
					payload: profile,
				});

				if (response.errorMessage) {
					dialog$.showError(response.errorMessage);
					return;
				}
				switch (response.responseCode) {
					case 0:
						dialog$.showError(response.responseMessage);
						break;
					case 1:
						dialog$.showFlash(
							"Profile created successfully",
							"Please login to HotUtils to manage your new profile",
							"",
							undefined,
							"success",
						);
						break;
					default:
						dialog$.showError("Unknown response from HotUtils");
				}
			} catch {
				(error: Error) => {
					dialog$.showError(error.message);
					return;
				};
			} finally {
				isBusy$.set(false);
			}
		},
		fetchProfile: async (allycode: string) => {
			const response = await post(
				"https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2/",
				{
					action: "getprofile",
					sessionId: hotutils$.getSessionIdOfProfile(allycode),
					payload: {
						allyCode: allycode,
					},
				},
			);

			if (response.errorMessage) {
				throw new Error(response.errorMessage);
			}

			const playerProfile: FetchedHUProfile = response.mods.profiles[0];

			// Convert mods to the serialized format recognized by the optimizer
			const profileMods = playerProfile.mods.map(Mod.fromHotUtils);

			// Convert each character to a PlayerValues object
			const profileValues: PlayerValuesByCharacter =
				playerProfile.characters.reduce(
					(
						characters: PlayerValuesByCharacter,
						character: DTOs.HU.HUPlayerValuesDTO,
					) => {
						characters[character.baseId] =
							Mappers.HU.HUPlayerValuesMapper.fromHU(character);
						return characters;
					},
					{} as PlayerValuesByCharacter,
				);

			return {
				name: playerProfile.name,
				mods: profileMods,
				playerValues: profileValues,
				updated: playerProfile.updated ?? false,
			} as FetchedGIMOProfile;
		},
		moveMods: async (loadout: Loadout) => {
			isBusy$.set(true);
			try {
				const response = await post(hotutilsv2mockbaseurl, {
					action: "movemods",
					sessionId: hotutils$.activeSessionId.get(),
					payload: loadout,
				});

				if (response.errorMessage) {
					dialog$.hide();
					dialog$.showError(response.errorMessage);
					return false;
				}
				switch (response.responseCode) {
					case 0:
						dialog$.hide();
						dialog$.showError(response.responseMessage);
						break;
					default: {
						hotutils$.moveStatus.taskId.set(response.taskId);
						hotutils$.moveStatus.message.set(response.status);
						if (response.taskId === 0) {
							dialog$.hide();
							dialog$.showFlash(
								"No action taken",
								"There were no mods to move!",
								"",
								undefined,
								"info",
							);
							return true;
						}
						hotutils$.isMoving.set(true);
						dialog$.hide();
						isBusy$.set(false);
						dialog$.show(<LazyModMoveProgress />, true);
						const pollStatus = await hotutils$.pollForModMoveStatus();
						return true;
					}
				}
				return false;
			} catch {
				(error: Error) => {
					dialog$.showError(error.message);
					return false;
				};
			} finally {
				isBusy$.set(false);
			}
			return false;
		},
		pollForModMoveStatus: async () => {
			try {
				const response = await post(hotutilsv2mockbaseurl, {
					action: "checkmovestatus",
					sessionId: hotutils$.activeSessionId.get(),
					payload: {
						taskId: hotutils$.moveStatus.taskId.get(),
					},
				});

				if (response.errorMessage) {
					dialog$.hide();
					dialog$.showError(response.errorMessage);
					return;
				}
				switch (response.responseCode) {
					case 0:
						dialog$.hide();
						dialog$.showError(response.responseCode);
						break;
					default:
						hotutils$.moveStatus.progress.assign(response.progress);
						hotutils$.moveStatus.message.set(response.responseMessage);
						if (!response.running) {
							hotutils$.isMoving.set(false);
							const updatedMods: Mod[] = response.mods.profiles[0].mods.map(
								Mod.fromHotUtils,
							);
							beginBatch();
							for (const mod of updatedMods) {
								profilesManagement$.activeProfile.modById[mod.id].set(mod);
							}
							endBatch();
							dialog$.hide();
							if (response.progress.index === response.progress.count) {
								dialog$.showFlash(
									`Mods successfully moved! (took ${
										Math.round(response.progress.elapsedMs / 10) / 100
									}s)`,
									"You may log into Galaxy of Heroes to see your characters",
									"",
									undefined,
									"success",
								);
								return;
							}
							dialog$.showFlash(
								"Mod move cancelled",
								`${response.progress.index} characters have already been updated.`,
								"",
								undefined,
								"warning",
							);
							return;
						}

						// If the move is still ongoing, then poll again after a few seconds.
						setTimeout(() => hotutils$.pollForModMoveStatus(), 2000);
				}
			} catch {
				(error: Error) => {
					dialog$.hide();
					dialog$.showError(error.message);
				};
			}
		},
	});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	hotutils$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		hotutils$.reset();
		return;
	}
	hotutils$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	hotutils$.sessionIdByProfile,
	persistOptions({
		persist: {
			name: "HotUtils",
			indexedDB: {
				itemID: "sessionIdByProfile",
			},
		},
		initial: {} as SessionIdByProfile,
	}),
);
await when(syncStatus$.isPersistLoaded);

export { hotutils$ };
