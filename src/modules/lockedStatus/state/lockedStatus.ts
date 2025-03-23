// utils
import { objectKeys } from "#/utils/objectKeys";

// state
import {
	beginBatch,
	endBatch,
	type Observable,
	observable,
	type ObservableObject,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);

// domain
import type { LockedStatusByCharacterId } from "../domain/LockedStatusByCharacterId";
import {
	getInitialLockedStatus,
	type LockedStatusObservable,
} from "../domain/LockedStatusObservable";

const lockedStatus$: ObservableObject<LockedStatusObservable> =
	observable<LockedStatusObservable>({
		persistedData: getInitialLockedStatus(),
		byCharacterIdByAllycode: () => {
			return lockedStatus$.persistedData.lockedStatus
				.lockedStatusByCharacterIdByAllycode;
		},
		ofActivePlayerByCharacterId: (): Observable<LockedStatusByCharacterId> => {
			return lockedStatus$.persistedData.lockedStatus
				.lockedStatusByCharacterIdByAllycode[
				profilesManagement$.profiles.activeAllycode.get()
			];
		},
		lockAll: () => {
			beginBatch();
			for (const characterId of objectKeys(
				lockedStatus$.ofActivePlayerByCharacterId.peek(),
			)) {
				lockedStatus$.ofActivePlayerByCharacterId[characterId].set(true);
			}
			endBatch();
		},
		unlockAll: () => {
			beginBatch();
			for (const characterId of objectKeys(
				lockedStatus$.ofActivePlayerByCharacterId.peek(),
			)) {
				lockedStatus$.ofActivePlayerByCharacterId[characterId].set(false);
			}
			endBatch();
		},
		reset: () => {
			syncStatus$.reset();
		},
	});

const syncStatus$ = syncObservable(
	lockedStatus$.persistedData,
	persistOptions({
		persist: {
			name: "LockedStatus",
		},
		initial: getInitialLockedStatus(),
	}),
);
await when(syncStatus$.isPersistLoaded);

export { lockedStatus$ };
