// state
import { beginBatch, endBatch, type Observable, observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { LockedStatusByCharacterIdByAllycode, LockedStatusByCharacterId } from "../domain/LockedStatusByCharacterId";
import { objectKeys } from "#/utils/objectKeys";

const lockedStatus$ = observable<{
	lockedStatusByCharacterIdByAllycode: LockedStatusByCharacterIdByAllycode;
	ofActivePlayerByCharacterId: () => Observable<LockedStatusByCharacterId>;
  lockAll: () => void;
  unlockAll: () => void;
}>({
	lockedStatusByCharacterIdByAllycode: {} as LockedStatusByCharacterIdByAllycode,
  ofActivePlayerByCharacterId: ():Observable<LockedStatusByCharacterId> => {
    return lockedStatus$.lockedStatusByCharacterIdByAllycode[
      profilesManagement$.profiles.activeAllycode.get()
    ];
  },
  lockAll: () => {
    beginBatch();
    for (const characterId of objectKeys(lockedStatus$.ofActivePlayerByCharacterId.peek())) {
      lockedStatus$.ofActivePlayerByCharacterId[characterId].set(true);
    }
    endBatch();
  },
  unlockAll: () => {
    beginBatch();
    for (const characterId of objectKeys(lockedStatus$.ofActivePlayerByCharacterId.peek())) {
      lockedStatus$.ofActivePlayerByCharacterId[characterId].set(false);
    }
    endBatch();
  },
});

syncObservable(lockedStatus$.lockedStatusByCharacterIdByAllycode, {
	persist: {
		name: "LockedStatus",
		indexedDB: {
			itemID: "lockedStatus",
		},
	},
});

export { lockedStatus$ };
