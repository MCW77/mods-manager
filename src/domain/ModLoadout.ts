// utils
import { objectKeys } from "#/utils/objectKeys.js";

// domain
import * as ModConsts from "./constants/ModConsts.js";

import type * as ModTypes from "./types/ModTypes.js";

import type { Mod } from "./Mod.js";

export type ModLoadout = Record<ModTypes.GIMOSlots, Mod | null>;

export const modSlotNotEmpty =
	(loadout: ModLoadout) => (slot: ModTypes.GIMOSlots) =>
		loadout[slot] !== null;

export function createModLoadout(mods: (Mod | null)[]): ModLoadout {
	const modLoadout: ModLoadout = {
		square: null,
		arrow: null,
		diamond: null,
		triangle: null,
		circle: null,
		cross: null,
	};

	for (const mod of mods.filter((mod) => null !== mod) as Mod[]) {
		modLoadout[mod.slot] = mod;
	}

	return modLoadout;
}

export function getUsedSlots(modLoadout: ModLoadout): ModTypes.GIMOSlots[] {
	const usedSlots: ModTypes.GIMOSlots[] = [];
	for (const slot of objectKeys(modLoadout)) {
		if (modLoadout[slot] !== null) {
			usedSlots.push(slot);
		}
	}
	return usedSlots;
}

export function hasSlots(
	modLoadout: ModLoadout,
	slots: ModTypes.GIMOSlots[],
): modLoadout is Record<ModTypes.GIMOSlots, Mod> {
	return slots.every((slot) => modLoadout[slot] !== null);
}

export function slotSort(leftMod: Mod, rightMod: Mod) {
	const leftIndex = ModConsts.gimoSlots.indexOf(leftMod.slot);
	const rightIndex = ModConsts.gimoSlots.indexOf(rightMod.slot);

	return leftIndex - rightIndex;
}
