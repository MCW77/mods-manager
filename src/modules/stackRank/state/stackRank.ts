// state
import { observable, type ObservableObject } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// api
import { fetchRankedCharacters } from "../api/fetchRankedCharacters";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import {
	getInitialStackRank,
	type StackRankObservable,
} from "../domain/StackRankObservable";
import type { StackRankSettings } from "../domain/StackRankSettings";

const defaultStackRankSettings: StackRankSettings = {
	useCase: "0",
	parameters: {
		alignmentFilter: "0",
		ignoreArena: true,
		minimumGearLevel: 1,
		top: 0,
		omicronGac: true,
		omicronTw: true,
		omicronTb: false,
		omicronRaids: false,
		omicronConquest: false,
	},
};

const stackRank$: ObservableObject<StackRankObservable> =
	observable<StackRankObservable>({
		persistedData: getInitialStackRank(),
		settingsForActiveAllycode: () => {
			const allycode = profilesManagement$.activeProfile.allycode.get();
			return stackRank$.settingsByAllycode[allycode]?.stackRankSettings;
		},
		settingsByAllycode: () => {
			return stackRank$.persistedData;
		},
		addProfile: (allycode: string) => {
			if (Object.hasOwn(stackRank$.settingsByAllycode.peek(), allycode)) return;
			stackRank$.settingsByAllycode[allycode].set({
				id: allycode,
				stackRankSettings: structuredClone(defaultStackRankSettings),
			});
		},
		deleteProfile: (allycode: string) => {
			if (!Object.hasOwn(stackRank$.settingsByAllycode.peek(), allycode))
				return;
			stackRank$.settingsByAllycode[allycode].delete();
		},
		reset: () => {
			syncStatus$.reset();
		},
		fetch: async (allycode: string): Promise<CharacterNames[]> => {
			const settings = stackRank$.settingsForActiveAllycode.peek();
			const parameters = {
				...settings?.parameters,
				ignoreArena: settings?.parameters?.ignoreArena ?? true,
			};
			const useCase = settings?.useCase ?? "";
			if (parameters.top === 0) delete parameters.top;
			try {
				const characters = await fetchRankedCharacters(
					allycode,
					useCase,
					parameters,
				);
				return characters;
			} catch (error) {
				throw new Error("Failed to fetch ranked characters", { cause: error });
			}
		},
	});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	stackRank$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		stackRank$.settingsByAllycode.set({});
		return;
	}
	stackRank$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	stackRank$.persistedData,
	persistOptions({
		persist: {
			name: "StackRank",
		},
		initial: getInitialStackRank(),
	}),
);

export { stackRank$, syncStatus$ };
