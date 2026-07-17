// state
import {
	beginBatch,
	endBatch,
	observable,
	type ObservableObject,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { CharacterById } from "#/domain/Character";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";

import {
	getInitialRoster,
	type RosterObservable,
} from "../domain/RosterObservable";

const roster$: ObservableObject<RosterObservable> = observable({
	persistedData: getInitialRoster(),
	activeCharacterById: () => {
		const activeAllycode = profilesManagement$.activeAllycode.get();
		return (
			roster$.persistedData[activeAllycode]?.characterById ??
			observable({} as CharacterById)
		);
	},
	characterByIdByAllycode: () => {
		return roster$.persistedData;
	},
	addProfile: (allycode: string) => {
		if (Object.hasOwn(roster$.characterByIdByAllycode.peek(), allycode)) return;
		roster$.persistedData[allycode].set({
			id: allycode,
			characterById: {},
		});
	},
	deleteProfile: (allycode: string) => {
		delete roster$.persistedData[allycode];
	},
	reset: () => {
		beginBatch();
		roster$.persistedData.set(getInitialRoster());
		endBatch();
	},
	saveTarget: (characterId: CharacterNames, newTarget: OptimizationPlan) => {
		const character = roster$.activeCharacterById[characterId];
		const characterTarget = character.targets.find(
			(target) => target.peek().id === newTarget.id,
		);
		if (characterTarget === undefined) {
			character.targets.push(newTarget);
		} else {
			characterTarget.set(newTarget);
		}
	},
	deleteTarget: (characterId: CharacterNames, targetIndex: number) => {
		const character = roster$.activeCharacterById[characterId];
		character.targets.splice(targetIndex, 1);
	},
	indexOfTarget: (characterId: CharacterNames, targetId: string) => {
		return roster$.activeCharacterById[characterId].targets
			.peek()
			.findIndex((target) => target.id === targetId);
	},
});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	roster$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		roster$.characterByIdByAllycode.set({});
		return;
	}
	roster$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	roster$.persistedData,
	persistOptions({
		persist: {
			name: "Roster",
		},
		initial: getInitialRoster(),
	}),
);

export { roster$, syncStatus$ };
