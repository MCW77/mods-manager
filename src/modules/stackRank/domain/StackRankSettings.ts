import type { StackRankParameters } from "./StackRankParameters";

interface StackRankSettings {
	useCase: "0" | "1" | "2" | "3";
	parameters: StackRankParameters;
}

interface StackRankSettingsForProfile {
	id: string;
	stackRankSettings: StackRankSettings;
}

type StackRankPersistedData = Record<string, StackRankSettingsForProfile>;

export type {
	StackRankSettings,
	StackRankSettingsForProfile,
	StackRankPersistedData,
};
