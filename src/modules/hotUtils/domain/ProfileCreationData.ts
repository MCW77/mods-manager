import type { CharacterDefinitions } from "../../modMove/domain/Loudout";

export interface ProfileCreationData {
	set: {
		category: string;
		name: string;
		units: CharacterDefinitions;
	};
}
