// state
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";


// domain
import type { CharacterNames } from "../constants/characterSettings";
import type * as ModTypes from "./types/ModTypes";

import type * as Character from "./Character";
import { Mod } from "./Mod";
import type { OptimizationPlan } from "./OptimizationPlan";
import * as OptimizerRun from "./OptimizerRun";
import type { SelectedCharacters } from "./SelectedCharacters";
import type { TargetStat } from "./TargetStat";

export type MissedGoals = [TargetStat, number][];

export interface ModSuggestion {
	id: CharacterNames;
	target: OptimizationPlan;
	assignedMods: string[];
	missedGoals: MissedGoals;
	messages?: string[];
}

export interface IFlatPlayerProfile {
	allycode: string;
	playerName: string;
	characters: Character.CharactersById;
	mods: ModTypes.GIMOFlatMod[];
	selectedCharacters: SelectedCharacters;
	modAssignments: ModSuggestion[];
}

/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
export class PlayerProfile {
	allycode: string;
	playerName: string;
	characters: Character.CharactersById;
	mods: Mod[];
	selectedCharacters: SelectedCharacters;
	modAssignments: ModSuggestion[];

	static Default: PlayerProfile = new PlayerProfile(
		"",
		"",
		{} as Character.CharactersById,
		[],
		[],
		[],
	);

	/**
	 * @param allycode {string} The ally code for the player whose data this is
	 * @param playerName {string} The player name associated with this profile
	 * @param characters {Object<string, Character>} A map from character IDs to character objects
	 * @param mods {Array<Mod>} An array of Mods
	 * @param selectedCharacters {Array<ISelectedCharacter>} An array of Objects with Character IDs and OptimizationPlans
	 * @param modAssignments {Array<Object>} An array of character definitions and assigned mods
	 */
	constructor(
		allycode: string,
		playerName: string,
		characters: Character.CharactersById = {} as Character.CharactersById,
		mods: Mod[] = [],
		selectedCharacters: SelectedCharacters = [],
		modAssignments: ModSuggestion[] = [],
	) {
		this.allycode = allycode;
		this.playerName = playerName;
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
			this.allycode,
			name,
			this.characters,
			this.mods,
			this.selectedCharacters,
			this.modAssignments,
		);
	}

	withCharacters(characters: Character.CharactersById) {
		if (!characters) {
			return this;
		}
		return new PlayerProfile(
			this.allycode,
			this.playerName,
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
			this.allycode,
			this.playerName,
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
			this.allycode,
			this.playerName,
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
			this.allycode,
			this.playerName,
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
			this.allycode,
			this.characters,
			lockedStatus$.ofActivePlayerByCharacterId.peek(),
			this.mods.map((mod) => mod.serialize()),
			this.selectedCharacters,
			optimizationSettings$.settingsByProfile[this.allycode].peek(),
		);
	}

	serialize() {
		return {
			allycode: this.allycode,
			playerName: this.playerName,
			characters: this.characters,
			mods: this.mods.map((mod) => mod.serialize()),
			selectedCharacters: this.selectedCharacters,
			modAssignments: this.modAssignments,
		};
	}

	static deserialize(flatPlayerProfile: IFlatPlayerProfile): PlayerProfile {
		if (!flatPlayerProfile) {
			return PlayerProfile.Default;
		}
		return new PlayerProfile(
			flatPlayerProfile.allycode,
			flatPlayerProfile.playerName,
			flatPlayerProfile.characters,
			flatPlayerProfile.mods.map(Mod.deserialize),
			flatPlayerProfile.selectedCharacters,
			flatPlayerProfile.modAssignments,
		);
	}
}
