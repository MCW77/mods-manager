// state
import type { Observable } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type {
	StackRankSettings,
	StackRankSettingsForProfile,
	StackRankPersistedData,
} from "./StackRankSettings";

interface StackRankObservable {
	persistedData: StackRankPersistedData;
	settingsByAllycode: () => Observable<
		Record<string, StackRankSettingsForProfile>
	>;
	settingsForActiveAllycode: () => Observable<StackRankSettings>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
	fetch: (allycode: string) => Promise<CharacterNames[]>;
}

const getInitialStackRank = (): StackRankPersistedData => {
	const stackRank: StackRankPersistedData = {};
	return stackRank;
};

export { type StackRankObservable, getInitialStackRank };
