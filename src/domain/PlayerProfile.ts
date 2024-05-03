// domain
import type { CharacterNames } from "../constants/characterSettings";
import type { PlayerValuesByCharacter } from "../modules/profilesManagement/domain/PlayerValues";
import type * as ModTypes from "./types/ModTypes";

import type * as Character from "./Character";
import { Mod } from "./Mod";
import type { OptimizationPlan } from "./OptimizationPlan";
import * as OptimizerRun from "./OptimizerRun";
import type { SelectedCharacters } from "./SelectedCharacters";
import type { TargetStat } from "./TargetStat";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";

export type MissedGoals = [TargetStat, number][];

export interface ModSuggestion {
	id: CharacterNames;
	target: OptimizationPlan;
	assignedMods: string[];
	missedGoals: MissedGoals;
	messages?: string[];
}

export interface IFlatPlayerProfile {
	allyCode: string;
	playerName: string;
	characters: Character.Characters;
	mods: ModTypes.GIMOFlatMod[];
	selectedCharacters: SelectedCharacters;
	modAssignments: ModSuggestion[];
}

/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
export class PlayerProfile {
	allyCode: string;
	playerName: string;
	characters: Character.Characters;
	playerValues: PlayerValuesByCharacter;
	mods: Mod[];
	selectedCharacters: SelectedCharacters;
	modAssignments: ModSuggestion[];

	static Default: PlayerProfile = new PlayerProfile(
		"",
		"",
		{} as PlayerValuesByCharacter,
		{} as Character.Characters,
		[],
		[],
		[],
	);

	/**
	 * @param allyCode {string} The ally code for the player whose data this is
	 * @param playerName {string} The player name associated with this profile
	 * @param playerValues {Object<string, PlayerValues>} A map from character IDs to PlayerValues
	 * @param characters {Object<string, Character>} A map from character IDs to character objects
	 * @param mods {Array<Mod>} An array of Mods
	 * @param selectedCharacters {Array<ISelectedCharacter>} An array of Objects with Character IDs and OptimizationPlans
	 * @param modAssignments {Array<Object>} An array of character definitions and assigned mods
	 */
	constructor(
		allyCode: string,
		playerName: string,
		playerValues: PlayerValuesByCharacter = {} as PlayerValuesByCharacter,
		characters: Character.Characters = {} as Character.Characters,
		mods: Mod[] = [],
		selectedCharacters: SelectedCharacters = [],
		modAssignments: ModSuggestion[] = [],
	) {
		this.allyCode = allyCode;
		this.playerName = playerName;
		this.playerValues = playerValues;
		this.characters = characters;
		this.mods = mods;
		this.selectedCharacters = selectedCharacters;
		this.modAssignments = modAssignments;
	}

	withPlayerName(name: string) {
		if (!name) {
			return this;
		}
		return new PlayerProfile(
			this.allyCode,
			name,
			this.playerValues,
			this.characters,
			this.mods,
			this.selectedCharacters,
			this.modAssignments,
		);
	}

	withCharacters(characters: Character.Characters) {
		if (!characters) {
			return this;
		}
		return new PlayerProfile(
			this.allyCode,
			this.playerName,
			this.playerValues,
			characters,
			this.mods,
			this.selectedCharacters,
			this.modAssignments,
		);
	}

	withMods(mods: Mod[]) {
		if (!mods) {
			return this;
		}
		return new PlayerProfile(
			this.allyCode,
			this.playerName,
			this.playerValues,
			this.characters,
			mods,
			this.selectedCharacters,
			this.modAssignments,
		);
	}

	withSelectedCharacters(selectedCharacters: SelectedCharacters) {
		if (!selectedCharacters) {
			return this;
		}
		return new PlayerProfile(
			this.allyCode,
			this.playerName,
			this.playerValues,
			this.characters,
			this.mods,
			selectedCharacters,
			this.modAssignments,
		);
	}

	withModAssignments(modAssignments: ModSuggestion[]) {
		if (!modAssignments) {
			return this;
		}
		// TODO
		/*
		this.mods.forEach((mod: Mod, i: number, mods: Mod[]) => {
			mod.assignedID = modAssignments.includes(mod.characterID) ? mod.characterID : 'null'
		});
*/
		return new PlayerProfile(
			this.allyCode,
			this.playerName,
			this.playerValues,
			this.characters,
			this.mods,
			this.selectedCharacters,
			modAssignments,
		);
	}

	/**
	 * Convert this full PlayerProfile into only what is needed to store the values form an optimizer run
	 * @returns OptimizerRun
	 */
	toOptimizerRun() {
		return OptimizerRun.createOptimizerRun(
			this.allyCode,
			this.characters,
			this.mods.map((mod) => mod.serialize()),
			this.selectedCharacters,
			optimizationSettings$.settingsByProfile[this.allyCode].peek(),
		);
	}

	serialize() {
		return {
			allyCode: this.allyCode,
			playerName: this.playerName,
			characters: this.characters,
			mods: this.mods.map((mod) => mod.serialize()),
			selectedCharacters: this.selectedCharacters.map(({ id, target }) => ({
				id: id,
				target: target,
			})),
			modAssignments: this.modAssignments,
		};
	}

	static deserialize(flatPlayerProfile: IFlatPlayerProfile): PlayerProfile {
		if (!flatPlayerProfile) {
			return PlayerProfile.Default;
		}
		return new PlayerProfile(
			flatPlayerProfile.allyCode,
			flatPlayerProfile.playerName,
			{} as PlayerValuesByCharacter,
			flatPlayerProfile.characters,
			flatPlayerProfile.mods.map(Mod.deserialize),
			flatPlayerProfile.selectedCharacters,
			flatPlayerProfile.modAssignments,
		);
	}
}
