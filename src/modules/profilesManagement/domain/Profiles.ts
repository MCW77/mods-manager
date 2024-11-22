// domain
import type {
	PersistedPlayerProfile,
	PlayerProfile,
} from "../domain/PlayerProfile";

interface Profiles {
	activeAllycode: string;
	lastUpdatedByAllycode: Record<string, { id: string; lastUpdated: number }>;
	playernameByAllycode: Record<string, string>;
	profileByAllycode: Record<string, PlayerProfile>;
}

interface PersistedProfiles {
	activeAllycode: string;
	lastUpdatedByAllycode: Record<string, { id: string; lastUpdated: number }>;
	playernameByAllycode: Record<string, string>;
	profileByAllycode: Record<string, PersistedPlayerProfile>;
}

export type { Profiles, PersistedProfiles };
