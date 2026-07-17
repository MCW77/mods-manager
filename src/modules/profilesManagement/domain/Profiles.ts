interface ProfilesManagementPersistedData {
	id: "profiles";
	profiles: Profiles;
}

interface Profiles {
	activeAllycode: string;
	lastUpdatedByAllycode: Record<string, { id: string; lastUpdated: number }>;
	playernameByAllycode: Record<string, string>;
}

export type { Profiles, ProfilesManagementPersistedData };
