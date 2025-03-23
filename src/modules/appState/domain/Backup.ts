// domain
import type { Compilation } from "#/modules/compilations/domain/Compilation";
import type { IndicesByProfile } from "#/modules/incrementalOptimization/domain/IncrementalOptimizationObservable";
import type { LockedStatusByCharacterIdByAllycode } from "#/modules/lockedStatus/domain/LockedStatusByCharacterId";
import type { PersistableModsViewSetupByIdByCategory } from "#/modules/modsView/domain/ModsViewOptions";
import type { SettingsByProfile } from "#/modules/optimizationSettings/domain/OptimizationSettingsObservable";
import type { PersistedProfiles } from "#/modules/profilesManagement/domain/Profiles";
import type { CharacterTemplatesByName } from "#/modules/templates/domain/CharacterTemplates";

interface Backup {
	characterTemplates: CharacterTemplatesByName;
	compilations: Map<string, Map<string, Compilation>>;
	defaultCompilation: Compilation;
	incrementalOptimizationIndices: IndicesByProfile;
	lockedStatus: LockedStatusByCharacterIdByAllycode;
	modsViewSetups: PersistableModsViewSetupByIdByCategory;
	profilesManagement: PersistedProfiles;
	sessionIds: Record<string, string>;
	settings: SettingsByProfile;
	version: string;
}

interface PersistableBackup {
	characterTemplates: CharacterTemplatesByName;
	compilations: Record<string, Record<string, Compilation>>;
	defaultCompilation: Compilation;
	incrementalOptimizationIndices: IndicesByProfile;
	lockedStatus: LockedStatusByCharacterIdByAllycode;
	modsViewSetups: PersistableModsViewSetupByIdByCategory;
	profilesManagement: PersistedProfiles;
	sessionIds: Record<string, string>;
	settings: SettingsByProfile;
	version: string;
	client: "mods-manager";
}

export type { Backup, PersistableBackup };
