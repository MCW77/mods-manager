import type { CharacterDefinitions } from "./Loudout";

export interface ProfileCreationData {
	set: {
		category: string;
		name: string;
		units: CharacterDefinitions;
	};
}
