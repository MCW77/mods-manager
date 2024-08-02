// react
import type { ThunkResult } from "../reducers/modsOptimizer";

// utils
import { mapValues } from "lodash-es";
import collectByKey from "../../utils/collectByKey";
import groupByKey from "../../utils/groupByKey";

// state
import getDatabase from "../storage/Database";

import { characters$ } from "#/modules/characters/state/characters";
import { dialog$ } from "#/modules/dialog/state/dialog";
import { templates$ } from "#/modules/templates/state/templates";

// modules
import { App } from "../../state/modules/app";
import { Data } from "../../state/modules/data";

// domain
import type { CharacterNames } from "../../constants/characterSettings";
import type { CharacterTemplate } from "../../modules/templates/domain/CharacterTemplates";
import * as Character from "#/domain/Character";
import {
	type OptimizationPlan,
	type OptimizationPlansById,
	createOptimizationPlan,
} from "../../domain/OptimizationPlan";
import * as OptimizerSettings from "#/domain/OptimizerSettings";
import type { PlayerProfile } from "../../domain/PlayerProfile";
import type { SelectedCharacters } from "../../domain/SelectedCharacters";

function getTargetsById(template: CharacterTemplate): OptimizationPlansById {
	return mapValues(
		collectByKey(
			template.selectedCharacters,
			({ id }: { id: CharacterNames }) => id,
		) as { [id in CharacterNames]: SelectedCharacters },
		(entries: SelectedCharacters) =>
			entries.map(({ target }: { target: OptimizationPlan }) => target),
	);
}

export namespace thunks {
	export function appendTemplate(name: string): ThunkResult<void> {
		const db = getDatabase();

		function updateFunction(template: CharacterTemplate) {
			return App.thunks.updateProfile(
				(profile) => {
					const templateTargetsById = getTargetsById(template);

					const availableCharacters = template.selectedCharacters.filter(
						({ id }) => Object.keys(profile.characters).includes(id),
					);

					const newProfile = profile.withCharacters(
						mapValues(profile.characters, (character: Character.Character) => {
							if (
								template.selectedCharacters
									.map(({ id }) => id)
									.includes(character.baseID)
							) {
								return Character.withOptimizerSettings(
									character,
									OptimizerSettings.withTargetOverrides(
										character.optimizerSettings,
										templateTargetsById[character.baseID],
									),
								);
							}
							return character;
						}) as Character.Characters,
					);

					return newProfile.withSelectedCharacters(
						profile.selectedCharacters.concat(availableCharacters),
					);
				},
				(dispatch, getState, newProfile) => {
					const baseCharactersById = characters$.baseCharactersById.peek();
					const missingCharacters = template.selectedCharacters
						.filter(
							({ id }) => !Object.keys(newProfile.characters).includes(id),
						)
						.map(({ id }) =>
							baseCharactersById[id] ? baseCharactersById[id].name : id,
						);
					if (missingCharacters.length) {
						dialog$.showFlash(
							"Missing Characters",
							`Missing the following characters from the selected template: ${missingCharacters.join(", ")}`,
							"",
							undefined,
							"warning",
						);
					}
				},
			);
		}

		return (dispatch, getState) => {
			const template =
				templates$.builtinTemplates.get().find(({ id }) => id === name) ??
				templates$.userTemplatesByName[name].get();
			updateFunction(template)(dispatch, getState, null);
		};
	}

	export function applyTemplateTargets(name: string): ThunkResult<void> {
		const db = getDatabase();

		function updateFunction(template: CharacterTemplate) {
			return App.thunks.updateProfile(
				(profile) => {
					const templateTargetsById: OptimizationPlansById =
						getTargetsById(template);
					const newProfile = profile.withCharacters(
						mapValues(profile.characters, (character: Character.Character) => {
							if (
								template.selectedCharacters
									.map(({ id }) => id)
									.includes(character.baseID)
							) {
								return Character.withOptimizerSettings(
									character,
									OptimizerSettings.withTargetOverrides(
										character.optimizerSettings,
										templateTargetsById[character.baseID],
									),
								);
							}
							return character;
						}) as Character.Characters,
					);

					const newSelectedCharacters = profile.selectedCharacters.slice(0);
					for (const {
						id: templateCharId,
						target: templateTarget,
					} of template.selectedCharacters) {
						for (const selectedCharacter of newSelectedCharacters) {
							if (selectedCharacter.id === templateCharId) {
								selectedCharacter.target = templateTarget;
							}
						}
					}

					return newProfile.withSelectedCharacters(newSelectedCharacters);
				},
				(dispatch, getState, newProfile) => {
					const baseCharactersById = characters$.baseCharactersById.peek();
					const missingCharacters = template.selectedCharacters
						.filter(
							({ id: templateCharId }) =>
								!newProfile.selectedCharacters
									.map(({ id }) => id)
									.includes(templateCharId),
						)
						.map(({ id }) =>
							baseCharactersById[id] ? baseCharactersById[id].name : id,
						);

					if (missingCharacters.length) {
						dialog$.showFlash(
							"Missing Characters",
							`The following characters weren\'t in your selected characters: ${missingCharacters.join(", ")}`,
							"",
							undefined,
							"warning",
						);
					}
				},
			);
		}

		return (dispatch, getState) => {
			const template =
				templates$.builtinTemplates.get().find(({ id }) => id === name) ??
				templates$.userTemplatesByName[name].get();
			updateFunction(template)(dispatch, getState, null);
		};
	}

	/**
	 * Action to change the selected target for a character
	 * @param characterIndex {Number} The index of the selected character whose target is being updated
	 * @param target {OptimizationPlan} The new target to use
	 * @returns {Function}
	 */
	export function changeCharacterTarget(
		characterIndex: number,
		target: OptimizationPlan,
	) {
		return App.thunks.updateProfile((profile: PlayerProfile) => {
			const newSelectedCharacters = profile.selectedCharacters.slice();
			if (characterIndex >= newSelectedCharacters.length) {
				return profile;
			}

			const [oldValue] = newSelectedCharacters.splice(characterIndex, 1);
			const newValue = Object.assign({}, oldValue, { target: target });
			newSelectedCharacters.splice(characterIndex, 0, newValue);

			return profile.withSelectedCharacters(newSelectedCharacters);
		});
	}

	/**
	 * Change the minimum dots that a mod needs to be used for a character
	 * @param characterID string The character ID of the character being updated
	 * @param minimumModDots Integer
	 * @returns {Function}
	 */
	export function changeMinimumModDots(
		characterID: CharacterNames,
		minimumModDots: number,
	) {
		return App.thunks.updateProfile((profile: PlayerProfile) => {
			const oldCharacter = profile.characters[characterID];

			return profile.withCharacters(
				Object.assign({}, profile.characters, {
					[characterID]: Character.withOptimizerSettings(
						oldCharacter,
						OptimizerSettings.withMinimumModDots(
							oldCharacter.optimizerSettings,
							minimumModDots,
						),
					),
				}),
			);
		});
	}

	/**
	 * Delete the currently selected target for a given character
	 * @param characterID {String} The character ID of the character being reset
	 * @param targetName {String} The name of the target to delete
	 * @returns {Function}
	 */
	export function deleteTarget(
		characterID: CharacterNames,
		targetName: string,
	) {
		return App.thunks.updateProfile(
			(profile: PlayerProfile) => {
				const oldCharacter = profile.characters[characterID];
				const newCharacters: Character.Characters = Object.assign(
					{},
					profile.characters,
					{
						[characterID]: Character.withDeletedTarget(
							oldCharacter,
							targetName,
						),
					},
				);

				const newSelectedCharacters = profile.selectedCharacters.map(
					({ id, target: oldTarget }) => {
						if (id === characterID && oldTarget.name === targetName) {
							const newTarget =
								Character.targets(newCharacters[characterID])[0] ??
								createOptimizationPlan("unnamed");

							return { id: id, target: newTarget };
						}
						return { id: id, target: oldTarget };
					},
				);

				return profile
					.withCharacters(newCharacters)
					.withSelectedCharacters(newSelectedCharacters);
			},
			(dispatch) => {
				dialog$.hide();
			},
		);
	}

	/**
	 * Action to complete the editing of a character target, applying the new target values to the character
	 * @param characterIndex {Number} The index in the selected characters list of the character being updated
	 * @param newTarget OptimizationPlan The new target to use for the character
	 * @returns {Function}
	 */
	export function finishEditCharacterTarget(
		characterID: CharacterNames,
		newTarget: OptimizationPlan,
	) {
		return App.thunks.updateProfile((profile: PlayerProfile) => {
			const newSelectedCharacters = profile.selectedCharacters.slice();
			const characterIndex = newSelectedCharacters.findIndex(
				({ id }) => id === characterID,
			);
			newSelectedCharacters.splice(characterIndex, 1, {
				id: characterID,
				target: newTarget,
			});
			const oldCharacter = profile.characters[characterID];
			const newCharacter = Character.withOptimizerSettings(
				oldCharacter,
				OptimizerSettings.withTarget(oldCharacter.optimizerSettings, newTarget),
			);

			return profile
				.withCharacters(
					Object.assign({}, profile.characters, {
						[newCharacter.baseID]: newCharacter,
					}),
				)
				.withSelectedCharacters(newSelectedCharacters);
		});
	}

	export function lockAllCharacters() {
		return App.thunks.updateProfile((profile: PlayerProfile) =>
			profile.withCharacters(
				mapValues(profile.characters, (character: Character.Character) =>
					Character.withOptimizerSettings(
						character,
						OptimizerSettings.lock(character.optimizerSettings),
					),
				) as Character.Characters,
			),
		);
	}

	/**
	 * Lock a character so that their mods won't be assigned to other characters
	 * @param characterID string the Character ID of the character being locked
	 * @returns {Function}
	 */
	export function lockCharacter(characterID: CharacterNames) {
		return App.thunks.updateProfile((profile: PlayerProfile) => {
			const oldCharacter = profile.characters[characterID];
			const newCharacters: Character.Characters = Object.assign(
				{},
				profile.characters,
				{
					[characterID]: Character.withOptimizerSettings(
						oldCharacter,
						OptimizerSettings.lock(oldCharacter.optimizerSettings),
					),
				},
			);

			return profile.withCharacters(newCharacters);
		});
	}

	/**
	 * Action to lock all characters from the "selected characters" pool
	 * @returns {Function}
	 */
	export function lockSelectedCharacters() {
		return App.thunks.updateProfile((profile: PlayerProfile) => {
			const selectedCharacterIDs: CharacterNames[] = Object.keys(
				groupByKey(profile.selectedCharacters, ({ id }) => id),
			) as CharacterNames[];

			return profile.withCharacters(
				mapValues(profile.characters, (character: Character.Character) =>
					selectedCharacterIDs.includes(character.baseID)
						? Character.withOptimizerSettings(
								character,
								OptimizerSettings.lock(character.optimizerSettings),
							)
						: character,
				) as Character.Characters,
			);
		});
	}

	/**
	 * Move an already-selected character to a new position in the selected list
	 * @param fromIndex {Number}
	 * @param toIndex {Number}
	 * @returns {Function}
	 */
	export function moveSelectedCharacter(
		fromIndex: number,
		toIndex: number | null,
	) {
		return App.thunks.updateProfile((profile) => {
			if (fromIndex === toIndex) {
				return profile;
			}
			const newSelectedCharacters = profile.selectedCharacters.slice();
			const [oldValue] = newSelectedCharacters.splice(fromIndex, 1);
			if (null === toIndex) {
				return profile.withSelectedCharacters(
					[oldValue].concat(newSelectedCharacters),
				);
			}
			if (fromIndex < toIndex) {
				newSelectedCharacters.splice(toIndex, 0, oldValue);
				return profile.withSelectedCharacters(newSelectedCharacters);
			}
			newSelectedCharacters.splice(toIndex + 1, 0, oldValue);
			return profile.withSelectedCharacters(newSelectedCharacters);
		});
	}

	export function replaceTemplate(templateName: string): ThunkResult<void> {
		const db = getDatabase();

		function updateFunction(template: CharacterTemplate) {
			return App.thunks.updateProfile(
				(profile) => {
					const templateTargetsById = getTargetsById(template);

					const availableCharacters = template.selectedCharacters.filter(
						({ id }) => Object.keys(profile.characters).includes(id),
					);

					const newProfile = profile.withCharacters(
						mapValues(profile.characters, (character: Character.Character) => {
							if (
								template.selectedCharacters
									.map(({ id }) => id)
									.includes(character.baseID)
							) {
								return Character.withOptimizerSettings(
									character,
									OptimizerSettings.withTargetOverrides(
										character.optimizerSettings,
										templateTargetsById[character.baseID],
									),
								);
							}
							return character;
						}) as Character.Characters,
					);

					return newProfile.withSelectedCharacters(availableCharacters);
				},
				(dispatch, getState, newProfile) => {
					const baseCharactersById = characters$.baseCharactersById.peek();
					const missingCharacters = template.selectedCharacters
						.filter(
							({ id }) => !Object.keys(newProfile.characters).includes(id),
						)
						.map(({ id }) =>
							baseCharactersById[id] ? baseCharactersById[id].name : id,
						);
					if (missingCharacters.length) {
						dialog$.showFlash(
							"Missing Characters",
							`Missing the following characters from the selected template: ${missingCharacters.join(", ")}`,
							"",
							undefined,
							"warning",
						);
					}
				},
			);
		}

		return (dispatch, getState) => {
			const template =
				templates$.builtinTemplates
					.get()
					.find(({ id }) => id === templateName) ??
				templates$.userTemplatesByName[templateName].get();
			updateFunction(template)(dispatch, getState, null);
		};
	}

	/**
	 * Reset all character targets so that they match the default values
	 * @returns {Function}
	 */
	export function resetAllCharacterTargets() {
		return App.thunks.updateProfile(
			(profile: PlayerProfile) => {
				const newCharacters: Character.Characters = mapValues(
					profile.characters,
					(character: Character.Character) =>
						Character.withResetTargets(character),
				) as Character.Characters;
				const newSelectedCharacters = profile.selectedCharacters.map(
					({ id, target: oldTarget }) => {
						const resetTarget = newCharacters[
							id
						].optimizerSettings.targets.find(
							(target) => target.name === oldTarget.name,
						);

						return resetTarget
							? { id: id, target: resetTarget }
							: { id: id, target: oldTarget };
					},
				);

				return profile
					.withCharacters(newCharacters)
					.withSelectedCharacters(newSelectedCharacters);
			},
			(dispatch) => dialog$.hide(),
		);
	}

	/**
	 * Reset a given target for a character to its default values
	 * @param characterID {String} The character ID of the character being reset
	 * @param targetName {String} The name of the target to reset
	 * @returns {Function}
	 */
	export function resetCharacterTargetToDefault(
		characterID: CharacterNames,
		targetName: string,
	) {
		return App.thunks.updateProfile(
			(profile: PlayerProfile) => {
				const newCharacter = Character.withResetTarget(
					profile.characters[characterID],
					targetName,
				);
				const resetTarget =
					newCharacter.optimizerSettings.targets.find(
						(target) => target.name === targetName,
					) || createOptimizationPlan("unnamed");

				const newSelectedCharacters = profile.selectedCharacters.map(
					({ id, target }) =>
						id === characterID && target.name === targetName
							? { id: id, target: resetTarget }
							: { id: id, target: target },
				);

				return profile
					.withCharacters(
						Object.assign({}, profile.characters, {
							[characterID]: newCharacter,
						}),
					)
					.withSelectedCharacters(newSelectedCharacters);
			},
			(dispatch) => {
				dialog$.hide();
			},
		);
	}

	export function saveTemplate(
		templateName: string,
		category: string,
	): ThunkResult<void> {
		const db = getDatabase();

		return (dispatch, getState) => {
			const state = getState();
			const selectedCharacters = state.profile.selectedCharacters;

			templates$.userTemplatesByName[templateName].set({
				id: templateName,
				category: category,
				selectedCharacters: selectedCharacters,
			});
		};
	}

	/**
	 * Action to move a character from the "available characters" pool to the "selected characters" pool, moving the
	 * character in order just underneath prevIndex, if it's supplied
	 * @param characterID {String} The character ID of the character being selected
	 * @param target {OptimizationPlan} The target to attach to the newly-selected character
	 * @param prevIndex {Number} Where in the selected characters list to place the new character
	 * @returns {Function}
	 */
	export function selectCharacter(
		characterID: CharacterNames,
		target: OptimizationPlan,
		prevIndex: number | null = null,
	) {
		const selectedCharacter = { id: characterID, target: target };

		return App.thunks.updateProfile((profile) => {
			const oldSelectedCharacters = profile.selectedCharacters;

			if (null === prevIndex) {
				// If there's no previous index, put the new character at the top of the list
				return profile.withSelectedCharacters(
					[selectedCharacter].concat(oldSelectedCharacters),
				);
			}
			const newSelectedCharacters = oldSelectedCharacters.slice();
			newSelectedCharacters.splice(prevIndex + 1, 0, selectedCharacter);

			return profile.withSelectedCharacters(newSelectedCharacters);
		});
	}

	export function toggleCharacterLock(characterID: CharacterNames) {
		return App.thunks.updateProfile((profile: PlayerProfile) => {
			const oldCharacter = profile.characters[characterID];
			const newCharacters: Character.Characters = Object.assign(
				{},
				profile.characters,
				{
					[characterID]: Character.withOptimizerSettings(
						oldCharacter,
						oldCharacter.optimizerSettings.isLocked
							? OptimizerSettings.unlock(oldCharacter.optimizerSettings)
							: OptimizerSettings.lock(oldCharacter.optimizerSettings),
					),
				},
			);

			return profile.withCharacters(newCharacters);
		});
	}

	export function unlockAllCharacters() {
		return App.thunks.updateProfile((profile: PlayerProfile) =>
			profile.withCharacters(
				mapValues(profile.characters, (character: Character.Character) =>
					Character.withOptimizerSettings(
						character,
						OptimizerSettings.unlock(character.optimizerSettings),
					),
				) as Character.Characters,
			),
		);
	}

	/**
	 * Unlock a character so that their mods can be assigned to other characters
	 * @param characterID string the Character ID of the character being unlocked
	 * @returns {Function}
	 */
	export function unlockCharacter(characterID: CharacterNames) {
		return App.thunks.updateProfile((profile: PlayerProfile) => {
			const oldCharacter = profile.characters[characterID];
			const newCharacters: Character.Characters = Object.assign(
				{},
				profile.characters,
				{
					[characterID]: Character.withOptimizerSettings(
						oldCharacter,
						OptimizerSettings.unlock(oldCharacter.optimizerSettings),
					),
				},
			);

			return profile.withCharacters(newCharacters);
		});
	}

	/**
	 * Action to unlock all characters from the "selected characters" pool
	 * @returns {Function}
	 */
	export function unlockSelectedCharacters() {
		return App.thunks.updateProfile((profile: PlayerProfile) => {
			const selectedCharacterIDs = Object.keys(
				groupByKey(profile.selectedCharacters, ({ id }) => id),
			);

			return profile.withCharacters(
				mapValues(profile.characters, (character: Character.Character) =>
					selectedCharacterIDs.includes(character.baseID)
						? Character.withOptimizerSettings(
								character,
								OptimizerSettings.unlock(character.optimizerSettings),
							)
						: character,
				) as Character.Characters,
			);
		});
	}

	/**
	 * Action to remove all characters from the "selected characters" pool, returning them to "available characters".
	 * @returns {Function}
	 */
	export function unselectAllCharacters() {
		return App.thunks.updateProfile((profile) =>
			profile.withSelectedCharacters([]),
		);
	}

	/**
	 * Move a character from the "selected characters" pool to the "available characters" pool.
	 * @param characterIndex {Number} The location of the character being unselected from the list
	 * @returns {Function}
	 */
	export function unselectCharacter(characterIndex: number) {
		return App.thunks.updateProfile((profile) => {
			const newSelectedCharacters = profile.selectedCharacters.slice();

			if (newSelectedCharacters.length > characterIndex) {
				newSelectedCharacters.splice(characterIndex, 1);
				return profile.withSelectedCharacters(newSelectedCharacters);
			}
			return profile;
		});
	}
}
