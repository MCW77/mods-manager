// utils
import * as v from "valibot";

// state
import { observable, type ObservableObject, when } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings.js";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement.js"
);

import { dialog$ } from "#/modules/dialog/state/dialog.js";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy.js";

// domain
import type { FetchedGIMOProfile } from "../domain/FetchedGIMOProfile.js";
import {
	FetchedFullGIMOProfileResponseSchema,
	type FetchedFullGIMOProfile,
} from "../domain/FetchedFullGIMOProfile.js";
import type { FetchedHUProfile } from "../domain/FetchedHUProfile.js";
import type { ProfileCreationData } from "../domain/ProfileCreationData.js";
import type * as DTOs from "#/modules/profilesManagement/dtos/index.js";
import * as Mappers from "#/modules/profilesManagement/mappers/index.js";
import type { PlayerValuesByCharacter } from "#/modules/profilesManagement/domain/PlayerValues.js";
import { Mod } from "#/domain/Mod.js";
import type { HotutilsObservable } from "../domain/HotutilsObservable.js";

const hotutilsv2baseurl =
	"https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2";

const initialPersistedData = {
	id: "sessionIDsByProfile",
	sessionIDsByProfile: new Map<
		string,
		{ gimoSessionId: string; huSessionId: string }
	>(),
} as const;

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
		persistedData: structuredClone(initialPersistedData),
		activeSessionId: () => {
			const allycode = profilesManagement$.profiles.activeAllycode.get();
			return hotutils$.sessionIDsByProfile[allycode].gimoSessionId.get() || "";
		},
		hasActiveSession: () => {
			return hotutils$.activeSessionId.get() !== "" && hotutils$.isSubscribed();
		},
		getGIMOSessionIdOfProfile: (allycode: string) => {
			return hotutils$.sessionIDsByProfile[allycode].gimoSessionId.peek() || "";
		},
		getHUSessionIdOfProfile: (allycode: string) => {
			return hotutils$.sessionIDsByProfile[allycode].huSessionId.peek() || "";
		},
		isSubscribed: () => hotutils$.checkSubscriptionStatus(),
		sessionIDsByProfile: () => {
			return hotutils$.persistedData.sessionIDsByProfile;
		},
		addProfile: (allycode: string) => {
			hotutils$.sessionIDsByProfile.set(allycode, {
				gimoSessionId: "",
				huSessionId: "",
			});
		},
		deleteProfile: (allycode: string) => {
			hotutils$.sessionIDsByProfile.delete(allycode);
		},
		reset: () => {
			syncStatus$.reset();
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
					sessionId: hotutils$.getGIMOSessionIdOfProfile(allycode),
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
		fetchFullProfile: async (allycode: string) => {
			if (hotutils$.getHUSessionIdOfProfile(allycode) === "") {
				return {} as FetchedFullGIMOProfile;
			}
			// Use Cloudflare Pages Function as proxy to set custom headers
			const response = await post(
				"https://api-test.mods-manager.pages.dev/huAll", // Your Cloudflare function endpoint
				{
					data: {
						sessionId: hotutils$.getHUSessionIdOfProfile(allycode),
					},
				},
			);

			if (response.errorMessage) {
				throw new Error(response.errorMessage);
			}

			const parseResult = v.safeParse(
				FetchedFullGIMOProfileResponseSchema,
				response,
			);
			if (!parseResult.success) {
				throw new Error("Failed to parse full profile from HotUtils");
			}

			return parseResult.output.data as FetchedFullGIMOProfile;
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
	hotutils$.persistedData,
	persistOptions({
		persist: {
			name: "HotUtils",
			indexedDB: {
				itemID: "sessionIDsByProfile",
			},
		},
		initial: initialPersistedData,
	}),
);
await when(syncStatus$.isPersistLoaded);

export { hotutils$ };
