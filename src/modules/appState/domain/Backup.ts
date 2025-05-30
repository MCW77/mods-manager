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

interface PersistableBackupData {
	characterTemplates: CharacterTemplatesByName;
	compilations: Record<string, Record<string, Compilation>>;
	defaultCompilation: Compilation | undefined;
	incrementalOptimizationIndices: IndicesByProfile;
	lockedStatus: LockedStatusByCharacterIdByAllycode;
	modsViewSetups: PersistableModsViewSetupByIdByCategory | undefined;
	profilesManagement: PersistedProfiles | undefined;
	sessionIds: Record<string, string>;
	settings: SettingsByProfile | undefined;
}

interface PersistableBackup extends PersistableBackupData {
	client: "mods-manager";
	version: string;
}

export type { Backup, PersistableBackupData, PersistableBackup };
