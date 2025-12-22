// react

// state
import { observable, beginBatch, endBatch } from "@legendapp/state";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { hotutils$ } from "#/modules/hotUtils/state/hotUtils";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";

// domain
import type { Loadout } from "../domain/Loudout";
import type { MoveStatus } from "../domain/MoveStatus";

import { Mod } from "#/domain/Mod";

// components
import LazyModMoveProgress from "../components/ModMoveProgress";

// components
import { ModMoveCancelModal } from "../../modMove/components/ModMoveCancelModal";

const _hotutilsv2mockbaseurl = "http://localhost:3001/humock";

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

const modMove$ = observable({
	isMoving: false,
	status: {
		progress: {
			index: 0,
			count: 0,
		},
		message: "",
	} as MoveStatus,
	cancelModMove: async () => {
		isBusy$.set(true);
		try {
			const response = await post(
				"https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
				{
					action: "cancelmove",
					sessionId: hotutils$.activeSessionId.get(),
					payload: {
						taskId: modMove$.status.taskId.get(),
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
					modMove$.isMoving.set(false);
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
	moveMods: async (loadout: Loadout) => {
		isBusy$.set(true);
		try {
			const response = await post(
				"https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
				{
					action: "movemods",
					sessionId: hotutils$.activeSessionId.get(),
					payload: loadout,
				},
			);

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
					modMove$.status.taskId.set(response.taskId);
					modMove$.status.message.set(response.status);
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
					modMove$.isMoving.set(true);
					dialog$.hide();
					isBusy$.set(false);
					dialog$.show(<LazyModMoveProgress />, true);
					modMove$.pollForModMoveStatus();
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
			const response = await post(
				"https://api.mods-optimizer.swgoh.grandivory.com/hotutils-v2",
				{
					action: "checkmovestatus",
					sessionId: hotutils$.activeSessionId.get(),
					payload: {
						taskId: modMove$.status.taskId.get(),
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
					modMove$.status.progress.assign(response.progress);
					modMove$.status.message.set(response.responseMessage);
					if (!response.running) {
						modMove$.isMoving.set(false);
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
					setTimeout(() => modMove$.pollForModMoveStatus(), 2000);
			}
		} catch {
			(error: Error) => {
				dialog$.hide();
				dialog$.showError(error.message);
			};
		}
	},
});

export { modMove$ };
