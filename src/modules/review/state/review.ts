// utils
import collectByKey from "#/utils/collectByKey";

// state
import { type Observable, observable } from "@legendapp/state";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const characters$ = stateLoader$.characters$;
const defaultCompilation$ = stateLoader$.defaultCompilation$;
const mods$ = stateLoader$.mods$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;

// domain
import { modRemovalCosts, modUpgradeCosts } from "../domain/ModCosts";
import type { CharacterNames } from "#/constants/CharacterNames";
import type { Mod } from "#/domain/Mod";
import type { SelectedCharacters } from "#/domain/SelectedCharacters";
import type {
	CharacterModding,
	CharacterModdings,
} from "#/modules/compilations/domain/CharacterModdings";
import type { ModListFilter } from "#/modules/review/domain/ModListFilter";

interface OptimizerView {
	charactersInCompilation: SelectedCharacters;
	oldLoadoutOfCharacters: Record<CharacterNames, Mod[]>;
	modListFilter: ModListFilter;
	selectedCharacter: CharacterNames;
	focusedCharacterIndex: number;
	selectedCharacterNewLoadout: Mod[];
	selectedCharacterOldLoadout: Mod[];
	selectedCharacterModding: CharacterModding;
	compilationModdings: CharacterModdings;
	oldCompilationValue: number;
	newCompilationValue: number;
	removedModsCount: number;
	removedMods: Set<Mod>;
	modUpgradeCost: number;
	modRemovalCost: number;
}

export const review$: Observable<OptimizerView> = observable<OptimizerView>({
	charactersInCompilation: () => {
		const allCharacters = defaultCompilation$.data.selectedCharacters.get();
		const filter = review$.modListFilter.get();
		const baseCharacterById = characters$.baseCharacterById.get();
		let filteredCharacters: SelectedCharacters = allCharacters.slice();
		if (filter.show === "upgrades") {
			filteredCharacters = filteredCharacters.filter((selectedCharacter) => {
				const compilationModdings = review$.compilationModdings.get();
				const modding = compilationModdings.find(
					(modding) => modding.characterId === selectedCharacter.id,
				);
				const assignedMods = modding?.assignedMods ?? [];
				return assignedMods.some(
					(mod) =>
						optimizationSettings$.shouldLevelMod(
							mod,
							selectedCharacter.target,
						) ||
						optimizationSettings$.shouldSliceMod(mod, selectedCharacter.target),
				);
			});
		}
		if (filter.show === "change") {
			filteredCharacters = filteredCharacters.filter((selectedCharacter) => {
				const compilationModdings = review$.compilationModdings.get();
				const modding = compilationModdings.find(
					(modding) => modding.characterId === selectedCharacter.id,
				);
				const assignedMods = modding?.assignedMods ?? [];
				return assignedMods.some(
					(mod) => mod.characterID !== selectedCharacter.id,
				);
			});
		}
		if (filter.tag !== "All") {
			filteredCharacters = filteredCharacters.filter((character) => {
				const tags = baseCharacterById[character.id]
					? baseCharacterById[character.id].categories
					: [];
				return tags.includes(filter.tag);
			});
		}
		return filteredCharacters;
	},
	removedMods: () => {
		const compilationModdings = review$.compilationModdings.get();
		const removedMods = new Set<Mod>();
		const oldLoadoutOfCharacters = review$.oldLoadoutOfCharacters.get();
		compilationModdings.forEach(({ characterId: id, assignedMods }) => {
			const oldLoadout = oldLoadoutOfCharacters[id] ?? [];
			for (let slotIndex = 0; slotIndex < 6; slotIndex++) {
				const oldMod = oldLoadout[slotIndex];
				const newMod = assignedMods[slotIndex];
				if (oldMod && newMod && oldMod.id !== newMod.id) {
					removedMods.add(oldMod);
					if (newMod.characterID !== "null") {
						removedMods.add(newMod);
					}
				}
			}
		});
		return removedMods;
	},
	removedModsCount: () => {
		const removedMods = review$.removedMods.get();
		return removedMods.size;
	},
	modUpgradeCost: () => {
		const compilationModdings = review$.compilationModdings.get();
		const modsBeingUpgraded = compilationModdings
			.filter(({ target }) => optimizationSettings$.shouldUpgradeMods(target))
			.map(({ assignedMods }) => assignedMods.filter((mod) => 15 !== mod.level))
			.reduce((allMods, characterMods) => allMods.concat(characterMods), []);

		const modUpgradeCost = modsBeingUpgraded.reduce(
			(cost, mod) => cost + modUpgradeCosts[mod.pips][mod.level],
			0,
		);
		return modUpgradeCost;
	},
	modRemovalCost: () => {
		const removedMods = Array.from(review$.removedMods.get());
		const modRemovalCost = removedMods.reduce(
			(cost, mod) => cost + modRemovalCosts[mod.pips],
			0,
		);
		return modRemovalCost;
	},
	oldCompilationValue: () => {
		const compilationModdings = review$.compilationModdings.get();
		return compilationModdings.reduce(
			(total, modding) => total + modding.previousScore,
			0,
		);
	},
	newCompilationValue: () => {
		const compilationModdings = review$.compilationModdings.get();
		return compilationModdings.reduce(
			(total, modding) => total + modding.currentScore,
			0,
		);
	},
	oldLoadoutOfCharacters: () => {
		const modsById = mods$.activeModById.get();
		const equippedMods = modsById
			.values()
			.filter((mod) => mod.characterID !== "null");
		return collectByKey(equippedMods, (mod: Mod) => mod.characterID);
	},
	modListFilter: {
		show: "all",
		sort: "assignedCharacter",
		tag: "All",
		view: "sets",
	},
	focusedCharacterIndex: 0,
	selectedCharacter: () => {
		const charactersInCompilation = review$.charactersInCompilation.get();
		const compilationModdings = review$.compilationModdings.get();
		return compilationModdings.length > 0
			? (compilationModdings.find((modding) =>
					charactersInCompilation.some(
						(char) => char.id === modding.characterId,
					),
				)?.characterId ?? "null")
			: "null";
	},
	selectedCharacterNewLoadout: () => {
		const modding = review$.selectedCharacterModding.get();
		return modding.assignedMods ?? [];
	},
	selectedCharacterOldLoadout: () => {
		const selectedCharacter = review$.selectedCharacter.get();
		const modsById = mods$.activeModById.get();
		const equippedMods: Mod[] = Array.from(
			modsById.values().filter((mod) => mod.characterID === selectedCharacter),
		);
		return equippedMods;
	},
	selectedCharacterModding: () => {
		const selectedCharacter = review$.selectedCharacter.get();
		const compilationModdings = review$.compilationModdings.get();
		const modding = compilationModdings.find(
			(modding) => modding.characterId === selectedCharacter,
		) ?? {
			characterId: selectedCharacter,
			assignedMods: [],
			missedGoals: [],
			target: defaultCompilation$.data.selectedCharacters
				.get()
				.find((character) => character.id === selectedCharacter)?.target ?? {
				name: "",
				description: "",
			},
			messages: [],
			currentScore: 0,
			previousScore: 0,
		};
		if (!modding)
			throw new Error(`No modding found for character ${selectedCharacter}`);
		return modding;
	},
	compilationModdings: () => {
		const modAssignments = defaultCompilation$.data.flatCharacterModdings.get();
		const modsById = mods$.activeModById.get();
		const characterModdings: CharacterModdings = modAssignments.map(
			(modAssignment) => {
				const characterModding: CharacterModding = {
					characterId: modAssignment.characterId,
					assignedMods: modAssignment.assignedMods
						.map((modId: string) => modsById.get(modId))
						.filter((mod) => !!mod),
					missedGoals: modAssignment.missedGoals,
					target: modAssignment.target,
					messages: modAssignment.messages,
					currentScore: modAssignment.currentScore,
					previousScore: modAssignment.previousScore,
				};
				return characterModding;
			},
		);
		return characterModdings;
	},
});
