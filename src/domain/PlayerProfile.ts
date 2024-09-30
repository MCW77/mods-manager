// state
import { lockedStatus$ } from "#/modules/lockedStatus/state/lockedStatus";
import { optimizationSettings$ } from "#/modules/optimizationSettings/state/optimizationSettings";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import type { CharacterNames } from "../constants/characterSettings";
import type * as ModTypes from "./types/ModTypes";

import { Mod } from "./Mod";
import type { OptimizationPlan } from "./OptimizationPlan";
import * as OptimizerRun from "./OptimizerRun";
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
	mods: ModTypes.GIMOFlatMod[];
}

/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
export class PlayerProfile {
	allycode: string;
	mods: Mod[];

	static Default: PlayerProfile = new PlayerProfile("", []);

	/**
	 * @param allycode {string} The ally code for the player whose data this is
	 * @param mods {Array<Mod>} An array of Mods
	 */
	constructor(allycode: string, mods: Mod[] = []) {
		this.allycode = allycode;
		this.mods = mods;
	}

	withMods(mods: Mod[]) {
		if (!mods) {
			return this;
		}
		return new PlayerProfile(this.allycode, mods);
	}

	/**
	 * Convert this full PlayerProfile into only what is needed to store the values form an optimizer run
	 * @returns OptimizerRun
	 */
	toOptimizerRun() {
		return OptimizerRun.createOptimizerRun(
			this.allycode,
			profilesManagement$.activeProfile.characterById.peek(),
			lockedStatus$.ofActivePlayerByCharacterId.peek(),
			this.mods.map((mod) => mod.serialize()),
			profilesManagement$.activeProfile.selectedCharacters.peek(),
			optimizationSettings$.settingsByProfile[this.allycode].peek(),
		);
	}

	serialize() {
		return {
			allycode: this.allycode,
			mods: this.mods.map((mod) => mod.serialize()),
		};
	}

	static deserialize(flatPlayerProfile: IFlatPlayerProfile): PlayerProfile {
		if (!flatPlayerProfile) {
			return PlayerProfile.Default;
		}
		return new PlayerProfile(
			flatPlayerProfile.allycode,
			flatPlayerProfile.mods.map(Mod.deserialize),
		);
	}
}
