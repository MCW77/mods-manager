// utils
import { objectKeys } from "#/utils/objectKeys";

// state
import {
	beginBatch,
	endBatch,
	type Observable,
	observable,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);

// domain
import type {
	LockedStatusByCharacterIdByAllycode,
	LockedStatusByCharacterId,
} from "../domain/LockedStatusByCharacterId";
import type { LockedStatusObservable } from "../domain/LockedStatusObservable";

const lockedStatus$ = observable<LockedStatusObservable>({
	lockedStatusByCharacterIdByAllycode:
		{} as LockedStatusByCharacterIdByAllycode,
	ofActivePlayerByCharacterId: (): Observable<LockedStatusByCharacterId> => {
		return lockedStatus$.lockedStatusByCharacterIdByAllycode[
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
	lockedStatus$.lockedStatusByCharacterIdByAllycode,
	persistOptions({
		persist: {
			name: "LockedStatus",
			indexedDB: {
				itemID: "lockedStatus",
			},
		},
		initial: {} as LockedStatusByCharacterIdByAllycode,
	}),
);
await when(syncStatus$.isPersistLoaded);

export { lockedStatus$ };
