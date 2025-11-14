// utils
import type * as v from "valibot";

// domain
import type { BackupSchema as GIMOBackupSchema } from "#/domain/schemas/gimo/BackupSchemas.js";
import type { Compilation } from "#/modules/compilations/domain/Compilation.js";
import { fromGIMOCharacterTemplates } from "#/modules/templates/mappers/GIMOCharacterTemplatesMapper.js";
import { fromGIMOOptimizationPlan } from "#/modules/templates/mappers/GIMOOptimizationPlanMapper.js";
import type { PersistedProfilesSchemaOutput } from "#/domain/schemas/mods-manager/PersistedProfilesSchemas.js";
import type { GIMOFlatMod } from "#/domain/types/ModTypes.js";

type GIMOBackup = v.InferOutput<typeof GIMOBackupSchema>;

const fromGIMOProfiles = (profiles: GIMOBackup["profiles"]) => {
	const profilesManagement: PersistedProfilesSchemaOutput = {
		activeAllycode: "",
		lastUpdatedByAllycode: {},
		playernameByAllycode: {},
		profileByAllycode: {},
	};

	for (const profile of profiles) {
		const allycode = profile.allyCode;
		profilesManagement.lastUpdatedByAllycode[allycode] = {
			id: profile.allyCode,
			lastUpdated: Date.now(),
		};
		profilesManagement.playernameByAllycode[allycode] = profile.playerName;
		profilesManagement.profileByAllycode[allycode] = {
			allycode: profile.allyCode,
			characterById: {},
			modById: new Map<string, GIMOFlatMod>(),
			playerName: profile.playerName,
		};
	}

	return profilesManagement;
};

const fromGIMOLastRuns = (
	lastRuns: GIMOBackup["lastRuns"],
): Record<string, Record<string, Compilation>> => {
	const compilationsByAllycode: Record<
		string,
		Record<string, Compilation>
	> = {};

	for (const run of lastRuns) {
		const allycode = run.allyCode;

		// Initialize allycode entry if it doesn't exist
		if (!compilationsByAllycode[allycode]) {
			compilationsByAllycode[allycode] = {};
		}

		// Use static ID - the merge logic will handle finding unique IDs
		const compilationId = "last-optmization-backup-1";

		// Create the compilation for this run
		compilationsByAllycode[allycode][compilationId] = {
			category: "GIMO Backups",
			description: `Backup from ally code ${allycode}`,
			flatCharacterModdings: [],
			id: compilationId,
			isReoptimizationNeeded: true,
			lastOptimized: null,
			optimizationConditions: null,
			reoptimizationIndex: -1,
			selectedCharacters: run.selectedCharacters.map((selectedCharacter) => ({
				id: selectedCharacter.id,
				target: fromGIMOOptimizationPlan(selectedCharacter.target),
			})),
		};
	}

	return compilationsByAllycode;
};

export const fromGIMOBackup = (backup: GIMOBackup) => {
	return {
		characterTemplates: fromGIMOCharacterTemplates(backup.characterTemplates),
		compilations: fromGIMOLastRuns(backup.lastRuns),
		profilesManagement: fromGIMOProfiles(backup.profiles),
	};
};
