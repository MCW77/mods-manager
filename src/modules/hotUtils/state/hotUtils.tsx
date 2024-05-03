// react
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// state
import {
	type ObservableComputed,
	type ObservableObject,
	computed,
	observable,
	observe,
} from "@legendapp/state";
import { persistObservable } from "@legendapp/state/persist";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// modules
import { App } from "#/state/modules/app";

// domain
import type { FetchedGIMOProfile } from "../domain/FetchedGIMOProfile";
import type { FetchedHUProfile } from "../domain/FetchedHUProfile";
import type { Loadout } from "../domain/Loudout";
import type { MoveStatus } from "../domain/MoveStatus";
import type { ProfileCreationData } from "../domain/ProfileCreationData";
import type * as DTOs from "#/modules/profilesManagement/dtos";
import * as Mappers from "#/modules/profilesManagement/mappers";
import type { PlayerValuesByCharacter } from "#/modules/profilesManagement/domain/PlayerValues";
import { Mod } from "#/domain/Mod";

// components
import { ModMoveCancelModal } from "../components/ModMoveCancelModal";
import { ModMoveProgress } from "../components/ModMoveProgress";

type SessionIdsByProfile = Record<string, string>;

interface HotUtils {
	moveStatus: MoveStatus;
	activeSessionId: ObservableComputed<string>;
	hasActiveSession: ObservableComputed<boolean>;
	isMoving: boolean;
	isSubscribed: ObservableComputed<Promise<boolean>>;
	sessionIdsByProfile: SessionIdsByProfile;
	cancelModMove: () => Promise<void>;
	checkSubscriptionStatus: () => Promise<boolean>;
	createProfile: (profile: ProfileCreationData) => Promise<void>;
	fetchProfile(allycode: string): Promise<FetchedGIMOProfile>;
	moveMods: (profile: Loadout, dispatch: ThunkDispatch) => Promise<void>;
	pollForModMoveStatus: (dispatch: ThunkDispatch) => Promise<void>;
}

const hotutilsv2baseurl = "https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2";
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

export const hotutils$: ObservableObject<HotUtils> = observable<HotUtils>({
	activeSessionId: computed<string>(() => {
		const allyCode = profilesManagement$.profiles.activeAllycode.get();
		return hotutils$.sessionIdsByProfile[allyCode].get() || "";
	}),
	hasActiveSession: computed<boolean>(
		() =>
			hotutils$.activeSessionId.get() !== "" && hotutils$.isSubscribed.get(),
	),
	isMoving: false,
	isSubscribed: computed<Promise<boolean>>(() =>
		hotutils$.checkSubscriptionStatus(),
	),
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
	sessionIdsByProfile: {},
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
	checkSubscriptionStatus: async () => {
		isBusy$.set(true);
		try {
			const response = await post(
				hotutilsv2baseurl,
				{
					action: "checksubscription",
					payload: {
						allyCode: profilesManagement$.profiles.activeAllycode.get(),
					},
				},
			);

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
			const response = await post(
				hotutilsv2baseurl,
				{
					action: "createprofile",
					sessionId: hotutils$.activeSessionId.get(),
					payload: profile,
				},
			);

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
				sessionId: hotutils$.activeSessionId.get(),
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
	moveMods: async (profile: Loadout, dispatch: ThunkDispatch) => {
		isBusy$.set(true);
		try {
			const response = await post(
				hotutilsv2mockbaseurl,
				{
					action: "movemods",
					sessionId: hotutils$.activeSessionId.get(),
					payload: profile,
				},
			);

			if (response.errorMessage) {
				dialog$.hide();
				dialog$.showError(response.errorMessage);
				return;
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
						return;
					}
					hotutils$.isMoving.set(true);
					dialog$.hide();
					isBusy$.set(false);
					dialog$.show(<ModMoveProgress />, true);
					return hotutils$.pollForModMoveStatus(dispatch);
				}
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
	pollForModMoveStatus: async (dispatch: ThunkDispatch) => {
		try {
			const response = await post(
				hotutilsv2mockbaseurl,
				{
					action: "checkmovestatus",
					sessionId: hotutils$.activeSessionId.get(),
					payload: {
						taskId: hotutils$.moveStatus.taskId.get(),
					},
				},
			);

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
						const updatedMods = response.mods.profiles[0].mods.map(
							Mod.fromHotUtils,
						);
						dispatch(
							App.thunks.updateProfile((profile) =>
								profile.withMods(updatedMods),
							),
						);
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
					setTimeout(() => hotutils$.pollForModMoveStatus(dispatch), 2000);
			}
		} catch {
			(error: Error) => {
				dialog$.hide();
				dialog$.showError(error.message);
			};
		}
	},
});

persistObservable(hotutils$.sessionIdsByProfile, {
	local: {
		name: "HotUtils",
		indexedDB: {
			itemID: "sessionIdsByProfile",
		},
	},
});
