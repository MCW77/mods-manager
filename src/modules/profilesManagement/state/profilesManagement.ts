// utils
import { formatTimespan } from "../utils/formatTimespan";

// state
import {
	type ObservableObject,
	observable,
	event,
	type Observable,
	beginBatch,
	endBatch,
	when,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { templates$ } from "#/modules/templates/state/templates";

// domain
import type { PlayerProfile } from "../domain/PlayerProfile";
import {
	characterSettings,
	type CharacterNames,
} from "#/constants/characterSettings";
import type * as Character from "#/domain/Character";
import { fromShortOptimizationPlan, type OptimizationPlan } from "#/domain/OptimizationPlan";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";

interface Profiles {
	activeAllycode: string;
	lastUpdatedByAllycode: Record<string, { id: string; lastUpdated: number }>;
	playernameByAllycode: Record<string, string>;
	profilesByAllycode: Record<string, PlayerProfile>;
}

interface ProfilesManagement {
	defaultProfile: PlayerProfile;
	profiles: Profiles;
	now: number;
	activeLastUpdated: () => string;
	activePlayer: () => string;
	activeProfile: () => Observable<PlayerProfile>;
	hasProfileWithAllycode: (allycode: string) => boolean;
	hasProfiles: () => boolean;
	addProfile: (profile: PlayerProfile) => void;
	clearProfiles: () => void;
	deleteProfile: (allycode: string) => void;
	updateProfile: (profile: PlayerProfile) => void;
	selectCharacter: (
		characterID: CharacterNames,
		target: OptimizationPlan,
		prevIndex: number | null,
	) => void;
	unselectCharacter: (characterIndex: number) => void;
	unselectAllCharacters: () => void;
	moveSelectedCharacter: (fromIndex: number, toIndex: number | null) => void;
	deleteTarget: (characterId: CharacterNames, targetName: string) => void;
	saveTarget: (
		characterId: CharacterNames,
		newTarget: OptimizationPlan,
	) => void;
	changeTarget: (index: number, target: OptimizationPlan) => void;
	reset: () => void;
	applyRanking: (ranking: CharacterNames[]) => void;
	appendTemplate: (templateName: string) => SelectedCharacters;
	replaceWithTemplate: (templateName: string) => SelectedCharacters;
	applyTemplateTargets: (templateName: string) => SelectedCharacters;
	ensureSelectedCharactersExistInProfile: (allycode: string) => void;
	ensureSelectedCharactersExist: () => void;
}

const getInitialProfiles = () => {
	return structuredClone({
	 activeAllycode: "",
	 playernameByAllycode: {},
	 profilesByAllycode: {},
	 lastUpdatedByAllycode: {},
 });
};

export const profilesManagement$: ObservableObject<ProfilesManagement> =
	observable<ProfilesManagement>({
		defaultProfile: {
			allycode: "",
			playerName: "",
			selectedCharacters: [],
			modAssignments: [],
			charactersById: {} as Character.CharactersById,
		},
		now: Date.now(),
		profiles: getInitialProfiles(),
		activeLastUpdated: () => {
			const allycode = profilesManagement$.profiles.activeAllycode.get();
			const elapsedTime =
				profilesManagement$.now.get() -
				profilesManagement$.profiles.lastUpdatedByAllycode[
					allycode
				].lastUpdated.get();
			return formatTimespan(elapsedTime);
		},
		activePlayer: () => {
			return profilesManagement$.profiles.playernameByAllycode[
				profilesManagement$.profiles.activeAllycode.get()
			].get();
		},
		activeProfile: () => {
			if (!profilesManagement$.hasProfiles.get()) {
				return profilesManagement$.defaultProfile;
			}
			return profilesManagement$.profiles.profilesByAllycode[
				profilesManagement$.profiles.activeAllycode.get()
			];
		},
		hasProfileWithAllycode: (allycode: string) => {
			return (
				profilesManagement$.profiles.profilesByAllycode[allycode].peek() !==
				undefined
			);
		},
		hasProfiles: () => {
			return (
				Object.keys(profilesManagement$.profiles.profilesByAllycode.get())
					.length > 0
			);
		},
		addProfile: (profile: PlayerProfile) => {
			profilesManagement$.profiles.profilesByAllycode.set({
				...profilesManagement$.profiles.profilesByAllycode.peek(),
				[profile.allycode]: profile,
			});
			profilesManagement$.profiles.playernameByAllycode.set({
				...profilesManagement$.profiles.playernameByAllycode.peek(),
				[profile.allycode]: profile.playerName,
			});
			profilesChanged$.fire();
		},
		clearProfiles: () => {
			profilesManagement$.profiles.profilesByAllycode.set({});
			profilesManagement$.profiles.playernameByAllycode.set({});
			profilesManagement$.profiles.activeAllycode.set("");
			profilesChanged$.fire();
		},
		deleteProfile: (allycode: string) => {
			profilesManagement$.profiles.profilesByAllycode[allycode].delete();
			profilesManagement$.profiles.playernameByAllycode[allycode].delete();
			profilesManagement$.profiles.activeAllycode.set(
				Object.keys(profilesManagement$.profiles.profilesByAllycode.peek())
					.length > 0
					? Object.keys(
							profilesManagement$.profiles.profilesByAllycode.peek(),
						)[0]
					: "",
			);
			profilesChanged$.fire();
		},
		updateProfile: (profile: PlayerProfile) => {
			profilesManagement$.profiles.profilesByAllycode[profile.allycode].set(
				profile,
			);
			profilesManagement$.profiles.lastUpdatedByAllycode.set({
				...profilesManagement$.profiles.lastUpdatedByAllycode.peek(),
				[profile.allycode]: { id: profile.allycode, lastUpdated: Date.now() },
			});
			profilesChanged$.fire();
		},
		selectCharacter: (
			characterID: CharacterNames,
			target: OptimizationPlan,
			prevIndex: number | null = null,
		) => {
			const selectedCharacter = { id: characterID, target: target };
			if (null === prevIndex) {
				profilesManagement$.activeProfile.selectedCharacters.unshift(
					selectedCharacter,
				);
			} else {
				profilesManagement$.activeProfile.selectedCharacters.splice(
					prevIndex + 1,
					0,
					selectedCharacter,
				);
			}
		},
		unselectCharacter: (characterIndex: number) => {
			if (
				characterIndex >=
				profilesManagement$.activeProfile.selectedCharacters.length
			)
				return;
			profilesManagement$.activeProfile.selectedCharacters.splice(
				characterIndex,
				1,
			);
		},
		unselectAllCharacters: () => {
			profilesManagement$.activeProfile.selectedCharacters.set([]);
		},
		moveSelectedCharacter: (fromIndex: number, toIndex: number | null) => {
			if (fromIndex === toIndex) return;
			const selectedCharacters =
				profilesManagement$.activeProfile.selectedCharacters.peek();
			const [selectedCharacter] =
				profilesManagement$.activeProfile.selectedCharacters.splice(
					fromIndex,
					1,
				);
			if (null === toIndex) {
				profilesManagement$.activeProfile.selectedCharacters.unshift(
					selectedCharacter,
				);
				return;
			}
			if (fromIndex < toIndex) {
				profilesManagement$.activeProfile.selectedCharacters.splice(
					toIndex,
					0,
					selectedCharacter,
				);
				return;
			}
			profilesManagement$.activeProfile.selectedCharacters.splice(
				toIndex + 1,
				0,
				selectedCharacter,
			);
		},
		deleteTarget: (characterId: CharacterNames, targetName: string) => {
			const targetIndex = profilesManagement$.activeProfile.charactersById[
				characterId
			].targets
				.peek()
				.findIndex((target) => target.id === targetName);
			if (targetIndex >= 0) {
				beginBatch();
				profilesManagement$.activeProfile.charactersById[
					characterId
				].targets.splice(targetIndex, 1);
				const selectedCharacter =
					profilesManagement$.activeProfile.selectedCharacters.find(
						(selectedCharacter) => selectedCharacter.peek().id === characterId,
					);
				selectedCharacter?.target.set(
					characterSettings[characterId].targets[0],
				);
				endBatch();
			}
		},
		saveTarget: (characterId: CharacterNames, newTarget: OptimizationPlan) => {
			const character =
				profilesManagement$.activeProfile.charactersById[characterId];
			const characterTarget = character.targets.find(
				(t) => t.peek().id === newTarget.id,
			);
			if (characterTarget === undefined) {
				character.targets.push(newTarget);
			} else {
				characterTarget.set(newTarget);
			}
			profilesManagement$.activeProfile.selectedCharacters
				.find(
					(selectedCharacter) => selectedCharacter.peek().id === characterId,
				)
				?.target.set(newTarget);
		},
		changeTarget: (index: number, target: OptimizationPlan) => {
			if (index >= profilesManagement$.activeProfile.selectedCharacters.length)
				return;
			profilesManagement$.activeProfile.selectedCharacters[index].target.set(
				target,
			);
		},
		reset: () => {
			syncStatus$.reset();
		},
		applyRanking: (ranking: CharacterNames[]) => {
			const selectedCharacters =
				profilesManagement$.activeProfile.selectedCharacters.peek();
			const rankingForSelected = ranking.filter((characterId) => selectedCharacters.some((selectedCharacter) => selectedCharacter.id === characterId));
			const newSelectedCharacters = rankingForSelected.map((characterId) => {
				const selectedCharacter = selectedCharacters.find(
					(selectedCharacter) => selectedCharacter.id === characterId,
				);
				return (
					selectedCharacter ?? {
						id: characterId,
						target: fromShortOptimizationPlan({id: "none"}),
					}
				);
			});
			profilesManagement$.activeProfile.selectedCharacters.set(
				newSelectedCharacters,
			);
		},
		appendTemplate: (templateName: string) => {
			const template = templates$.allTemplates
				.get()
				.find(({ id }) => id === templateName);
			if (template === undefined) return [];

			const splitSelectedCharacters = Object.groupBy(
				template.selectedCharacters,
				(selectedCharacter) =>
					Object.keys(
						profilesManagement$.activeProfile.charactersById.peek(),
					).includes(selectedCharacter.id)
						? "existing"
						: "missing",
			);

			if (splitSelectedCharacters.existing === undefined) return [];
			for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
				const target = structuredClone(selectedCharacterInTemplate.target);
				const selectedCharacter =
					profilesManagement$.activeProfile.selectedCharacters.find(
						(selectedCharacter) =>
							selectedCharacter.peek().id === selectedCharacterInTemplate.id,
					);
				if (selectedCharacter === undefined) {
					profilesManagement$.selectCharacter(
						selectedCharacterInTemplate.id,
						target,
						profilesManagement$.activeProfile.selectedCharacters.length - 1,
					);
				} else {
					selectedCharacter.target.set(selectedCharacterInTemplate.target);
				}
				const character =
					profilesManagement$.activeProfile.charactersById[
						selectedCharacterInTemplate.id
					];
				if (character === undefined) continue;
				const characterTarget = character.targets.find(
					(t) => t.peek().id === selectedCharacterInTemplate.target.id,
				);
				if (characterTarget === undefined) {
					const builtinTarget = characterSettings[
						selectedCharacterInTemplate.id
					].targets.find((t) => t.id === selectedCharacterInTemplate.target.id);
					if (builtinTarget !== undefined) continue;
					character.targets.push(target);
				} else {
					characterTarget.set(target);
				}
			}
			if (splitSelectedCharacters.missing?.length) {
				return splitSelectedCharacters.missing;
			}
			return [];
		},
		replaceWithTemplate: (templateName: string) => {
			const template = templates$.allTemplates
				.get()
				.find(({ id }) => id === templateName);
			if (template === undefined) return [];

			const splitSelectedCharacters = Object.groupBy(
				template.selectedCharacters,
				(selectedCharacter) =>
					Object.keys(
						profilesManagement$.activeProfile.charactersById.peek(),
					).includes(selectedCharacter.id)
						? "existing"
						: "missing",
			);
			profilesManagement$.activeProfile.selectedCharacters.set(
				splitSelectedCharacters.existing?.slice() ?? [],
			);

			if (splitSelectedCharacters.existing === undefined) return [];
			for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
				const target = structuredClone(selectedCharacterInTemplate.target);
				const character =
					profilesManagement$.activeProfile.charactersById[
						selectedCharacterInTemplate.id
					];
				if (character === undefined) continue;
				const characterTarget = character.targets.find(
					(t) => t.peek().id === selectedCharacterInTemplate.target.id,
				);
				if (characterTarget === undefined) {
					const builtinTarget = characterSettings[
						selectedCharacterInTemplate.id
					].targets.find((t) => t.id === selectedCharacterInTemplate.target.id);
					if (builtinTarget !== undefined) continue;
					character.targets.push(target);
				} else {
					characterTarget.set(target);
				}
			}
			if (splitSelectedCharacters.missing?.length) {
				return splitSelectedCharacters.missing;
			}
			return [];
		},
		applyTemplateTargets: (templateName: string) => {
			const template = templates$.allTemplates
				.get()
				.find(({ id }) => id === templateName);
			if (template === undefined) return [];

			const splitSelectedCharacters = Object.groupBy(
				template.selectedCharacters,
				(templateSelectedCharacter) =>
					profilesManagement$.activeProfile.selectedCharacters
						.peek()
						.some(
							(selectedCharacter) =>
								selectedCharacter.id === templateSelectedCharacter.id,
						)
						? "existing"
						: "missing",
			);

			if (splitSelectedCharacters.existing === undefined) return [];
			for (const selectedCharacterInTemplate of splitSelectedCharacters.existing) {
				const target = structuredClone(selectedCharacterInTemplate.target);
				const selectedCharacter =
					profilesManagement$.activeProfile.selectedCharacters.find(
						(selectedCharacter) =>
							selectedCharacter.peek().id === selectedCharacterInTemplate.id,
					);
				if (selectedCharacter === undefined) continue;
				selectedCharacter.target.set(selectedCharacterInTemplate.target);
			}

			if (splitSelectedCharacters.missing?.length) {
				/*
				dialog$.showFlash(
					"Missing Characters",
					`Missing the following characters from the selected template: ${splitSelectedCharacters.missing.map((missingChar) => missingChar.id).join(", ")}`,
					"",
					undefined,
					"warning",
				);
*/
				return splitSelectedCharacters.missing;
			}
			return [];
		},
		ensureSelectedCharactersExistInProfile: (allycode: string) => {
			const profile = profilesManagement$.profiles.profilesByAllycode[allycode];
			for (const [
				index,
				selectedCharacter,
			] of profile.selectedCharacters.entries()) {
				if (profile.charactersById[selectedCharacter.id].peek() === undefined) {
					profile.selectedCharacters.splice(index, 1);
				}
			}
		},
		ensureSelectedCharactersExist: () => {
			for (const allycode of Object.keys(
				profilesManagement$.profiles.profilesByAllycode.peek(),
			)) {
				profilesManagement$.ensureSelectedCharactersExistInProfile(allycode);
			}
		},
	});

export const profilesChanged$ = event();

const nowTimer = setInterval(() => {
	profilesManagement$.now.set(Date.now());
}, 500);

const syncStatus$ = syncObservable(profilesManagement$.profiles, {
	persist: {
		name: "Profiles",
		indexedDB: {
			itemID: "profiles",
		},
	},
	initial: getInitialProfiles(),
});
(async () => {
	await when(syncStatus$.isPersistLoaded);
})();

