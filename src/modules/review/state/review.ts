// utils
import collectByKey from "#/utils/collectByKey";

// state
import { observable } from "@legendapp/state";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";
const mods$ = stateLoader$.mods$;

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { Mod } from "#/domain/Mod";
import type { ModListFilter } from "#/modules/review/domain/ModListFilter";

interface OptimizerView {
	modListFilter: ModListFilter;
	loadoutOfCharacters: Record<CharacterNames, Mod[]>;
}

export const review$ = observable<OptimizerView>({
	modListFilter: {
		show: "all",
		sort: "assignedCharacter",
		tag: "All",
		view: "sets",
	},
	loadoutOfCharacters: () => {
		const modsById = mods$.activeModById.get();
		const equippedMods = modsById
			.values()
			.filter((mod) => mod.characterID !== "null");
		return collectByKey(equippedMods, (mod: Mod) => mod.characterID);
	},
});
