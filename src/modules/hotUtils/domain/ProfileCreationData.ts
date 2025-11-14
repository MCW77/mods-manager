import type { CharacterDefinitions } from "../../modMove/domain/Loudout.js";

export interface ProfileCreationData {
	set: {
		category: string;
		name: string;
		units: CharacterDefinitions;
	};
}
