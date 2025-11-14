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
import { persistOptions } from "#/utils/globalLegendPersistSettings.js";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement.js"
);

// domain
import {
	type CharacterNames,
	characterNames,
} from "#/constants/CharacterNames.js";
import type { LockedCharacters } from "../domain/LockedStatusByCharacterId.js";
import {
	getInitialLockedStatus,
	type LockedStatusObservable,
} from "../domain/LockedStatusObservable.js";

const lockedStatus$: ObservableObject<LockedStatusObservable> =
	observable<LockedStatusObservable>({
		persistedData: getInitialLockedStatus(),
		lockedCharactersByAllycode: () => {
			return lockedStatus$.persistedData.lockedStatus
				.lockedCharactersByAllycode;
		},
		lockedCharactersForActivePlayer: (): Observable<LockedCharacters> => {
			return lockedStatus$.persistedData.lockedStatus
				.lockedCharactersByAllycode[
				profilesManagement$.profiles.activeAllycode.get()
			];
		},
		isCharacterLockedForActivePlayer: (
			characterId: CharacterNames,
		): boolean => {
			return lockedStatus$.lockedCharactersForActivePlayer
				.get()
				.has(characterId);
		},
		addProfile: (allycode: string) => {
			lockedStatus$.persistedData.lockedStatus.lockedCharactersByAllycode[
				allycode
			].set(new Set<CharacterNames>());
		},
		deleteProfile: (allycode: string) => {
			delete lockedStatus$.persistedData.lockedStatus
				.lockedCharactersByAllycode[allycode];
		},
		lockAll: () => {
			beginBatch();
			for (const characterId of characterNames) {
				lockedStatus$.lockedCharactersForActivePlayer.add(characterId);
			}
			endBatch();
		},
		unlockAll: () => {
			lockedStatus$.lockedCharactersForActivePlayer.clear();
		},
		toggleCharacterForActivePlayer: (characterId: CharacterNames) => {
			if (lockedStatus$.lockedCharactersForActivePlayer.has(characterId))
				lockedStatus$.lockedCharactersForActivePlayer.delete(characterId);
			else lockedStatus$.lockedCharactersForActivePlayer.add(characterId);
		},
		reset: () => {
			syncStatus$.reset();
		},
	});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	lockedStatus$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		lockedStatus$.reset();
		return;
	}
	lockedStatus$.deleteProfile(value);
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
