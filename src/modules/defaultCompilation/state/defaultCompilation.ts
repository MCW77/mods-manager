// state
import {
	beginBatch,
	endBatch,
	observable,
	type ObservableObject,
} from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { characters$ } from "#/modules/characters/state/characters";
import { mods$ } from "#/modules/mods/state/mods";
import { roster$ } from "#/modules/roster/state/roster";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import { characterSettings } from "#/constants/characterSettings";
import {
	type Combination,
	type CombinationKey,
	getCombinationKey,
} from "#/domain/Combination";
import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";
import {
	fromShortOptimizationPlan,
	type OptimizationPlan,
} from "#/domain/OptimizationPlan";
import type { Pips } from "#/domain/Pips";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";
import { gimoSlots } from "#/domain/types/ModTypes";
import type { BaseCharacter } from "#/modules/characters/domain/BaseCharacter";
import { getDefaultCompilation } from "../domain/DefaultCompilation";
import type { DefaultCompilationObservable } from "../domain/DefaultCompilationObservable";

const defaultCompilation$: ObservableObject<DefaultCompilationObservable> =
	observable<DefaultCompilationObservable>({
		persistedData: getDefaultCompilation(),
		data: () => defaultCompilation$.persistedData.defaultCompilation,
		selectCharacter: (
			characterID: CharacterNames,
			target: OptimizationPlan,
			prevIndex: number | null = null,
		) => {
			const selectedCharacter = { id: characterID, target: target };
			if (
				defaultCompilation$.data.selectedCharacters.some(
					(sc) => sc.peek().id === characterID,
				)
			)
				return;
			if (null === prevIndex) {
				defaultCompilation$.data.selectedCharacters.unshift(selectedCharacter);
				defaultCompilation$.data.reoptimizationIndex.set(-1);
			} else {
				defaultCompilation$.data.selectedCharacters.splice(
					prevIndex + 1,
					0,
					selectedCharacter,
				);
				defaultCompilation$.data.reoptimizationIndex.set(
					Math.min(
						prevIndex,
						defaultCompilation$.data.reoptimizationIndex.peek(),
					),
				);
			}
		},
		unselectCharacter: (characterIndex: number) => {
			if (characterIndex >= defaultCompilation$.data.selectedCharacters.length)
				return;
			defaultCompilation$.data.reoptimizationIndex.set(
				Math.min(
					characterIndex - 1,
					defaultCompilation$.data.reoptimizationIndex.peek(),
				),
			);
			defaultCompilation$.data.selectedCharacters.splice(characterIndex, 1);
		},
		unselectAllCharacters: () => {
			defaultCompilation$.data.selectedCharacters.set([]);
			defaultCompilation$.data.reoptimizationIndex.set(-1);
		},
		moveSelectedCharacter: (fromIndex: number, toIndex: number | null) => {
			if (fromIndex === toIndex) return;
			defaultCompilation$.data.reoptimizationIndex.set(
				Math.min(
					fromIndex - 1,
					(toIndex ?? fromIndex) - 1,
					defaultCompilation$.data.reoptimizationIndex.peek(),
				),
			);

			const [selectedCharacter] =
				defaultCompilation$.data.selectedCharacters.splice(fromIndex, 1);
			if (null === toIndex) {
				defaultCompilation$.data.selectedCharacters.unshift(selectedCharacter);
				return;
			}
			if (fromIndex < toIndex) {
				defaultCompilation$.data.selectedCharacters.splice(
					toIndex,
					0,
					selectedCharacter,
				);
				return;
			}
			defaultCompilation$.data.selectedCharacters.splice(
				toIndex + 1,
				0,
				selectedCharacter,
			);
		},
		deleteTarget: (characterId: CharacterNames, targetName: string) => {
			const characterIndex =
				defaultCompilation$.data.selectedCharacters.findIndex(
					(selectedCharacter) => selectedCharacter.peek().id === characterId,
				);
			const targetIndex = roster$.indexOfTarget(characterId, targetName);
			if (targetIndex >= 0) {
				beginBatch();
				defaultCompilation$.data.reoptimizationIndex.set(
					Math.min(
						characterIndex - 1,
						defaultCompilation$.data.reoptimizationIndex.peek(),
					),
				);
				roster$.deleteTarget(characterId, targetIndex);
				const selectedCharacter =
					defaultCompilation$.data.selectedCharacters[characterIndex];
				selectedCharacter?.target.set(
					characterSettings[characterId].targets[0],
				);
				endBatch();
			}
		},
		saveTarget: (characterId: CharacterNames, newTarget: OptimizationPlan) => {
			roster$.saveTarget(characterId, newTarget);
			defaultCompilation$.data.selectedCharacters
				.find(
					(selectedCharacter) => selectedCharacter.peek().id === characterId,
				)
				?.target.set(newTarget);
		},
		changeTarget: (index: number, target: OptimizationPlan) => {
			if (index >= defaultCompilation$.data.selectedCharacters.length) return;
			defaultCompilation$.data.selectedCharacters[index].target.set(target);
			defaultCompilation$.data.reoptimizationIndex.set(
				Math.min(
					index - 1,
					defaultCompilation$.data.reoptimizationIndex.peek(),
				),
			);
		},
		applyRanking: (ranking: CharacterNames[]) => {
			const selectedCharacters =
				defaultCompilation$.data.selectedCharacters.peek();
			const rankingForSelected = ranking.filter((characterId) =>
				selectedCharacters.some(
					(selectedCharacter) => selectedCharacter.id === characterId,
				),
			);
			const newSelectedCharacters = rankingForSelected.map((characterId) => {
				const selectedCharacter = selectedCharacters.find(
					(selectedCharacter) => selectedCharacter.id === characterId,
				);
				return (
					selectedCharacter ?? {
						id: characterId,
						target: fromShortOptimizationPlan({ id: "none" }),
					}
				);
			});
			defaultCompilation$.data.selectedCharacters.set(newSelectedCharacters);
			defaultCompilation$.data.reoptimizationIndex.set(-1);
		},
		reset: () => {
			syncStatus$.reset();
		},
		ensurePilot6DotRequirements: () => {
			const baseCharactersById = characters$.baseCharacterById.peek();
			const selectedCharacters =
				defaultCompilation$.data.selectedCharacters.peek();
			const last6DotGuaranteedIndex = mods$.minimalFull6Dot.peek() - 1;
			const indicesOfPilots: number[] = [];
			let selectedCharacter: SelectedCharacters[number];
			let character: BaseCharacter;
			for (
				let index = last6DotGuaranteedIndex + 1;
				index < selectedCharacters.length;
				index++
			) {
				selectedCharacter = selectedCharacters[index];
				character = baseCharactersById[selectedCharacter.id];
				if (
					character.categories.includes("Crew Member") &&
					selectedCharacter.target.minimumModDots >= 6
				) {
					indicesOfPilots.push(index);
				}
			}
			const firstInsertionIndex =
				last6DotGuaranteedIndex - (indicesOfPilots.length - 1);
			beginBatch();
			for (let index = 0; index < indicesOfPilots.length; index++) {
				defaultCompilation$.moveSelectedCharacter(
					indicesOfPilots[index],
					firstInsertionIndex - 1 + index,
				);
			}
			endBatch();
		},
		hardRequirements: () => {
			const hardRequirementsByCombination = new Map<
				CombinationKey,
				{ combination: Combination; count: number }
			>();
			const selectedCharacters =
				defaultCompilation$.data.selectedCharacters.peek();
			const targets = selectedCharacters.map(
				(selectedCharacter) => selectedCharacter.target,
			);
			for (const target of targets) {
				const setRestrictions = target.setRestrictions;
				const entries = Object.entries(setRestrictions);
				if (entries.length === 0) continue;
				const accumulatedRequirements = new Map<GIMOSetStatNames, number>();
				for (const [setName, requiredCount] of entries) {
					const currentCount =
						accumulatedRequirements.get(setName as GIMOSetStatNames) ?? 0;
					accumulatedRequirements.set(
						setName as GIMOSetStatNames,
						requiredCount + currentCount,
					);
				}
				if (accumulatedRequirements.size === 1) {
					const [setName, count] = [...accumulatedRequirements.entries()][0];
					if (count === 3) {
						for (const slot of gimoSlots) {
							let primaryStatRestrictions: string[] = [""];
							if (slot !== "square" && slot !== "diamond") {
								primaryStatRestrictions = [
									...(target.primaryStatRestrictions?.[slot] ?? [""]),
								];
							}
							const combination = {
								slot,
								modset: setName,
								primaryStats: primaryStatRestrictions,
								pips: target.minimumModDots as Pips,
							};
							const combinationKey = getCombinationKey({
								slot,
								modset: setName,
								primaryStats: primaryStatRestrictions,
								pips: target.minimumModDots as Pips,
							});
							hardRequirementsByCombination.set(combinationKey, {
								combination,
								count:
									(hardRequirementsByCombination.get(combinationKey)?.count ??
										0) + 1,
							});
						}
					}
				}
			}
			return hardRequirementsByCombination;
		},
	});

const syncStatus$ = syncObservable(
	defaultCompilation$.persistedData,
	persistOptions({
		persist: {
			name: "DefaultCompilation",
			indexedDB: {
				itemID: "defaultCompilation",
			},
		},
		initial: getDefaultCompilation(),
	}),
);

export { defaultCompilation$, syncStatus$ };
