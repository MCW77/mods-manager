// state
import { observable, type ObservableObject } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import {
	getInitialDatacrons,
	type DatacronsObservable,
} from "../domain/DatacronsObservable";
import { filterDatacrons, type DatacronSet } from "../domain/DatacronFilter";
import DatacronSets from "../DatacronSets.json";
import type { Datacron, DatacronById } from "../domain/Datacrons";
import { findAffix } from "../utils/findAffix";

const datacrons$: ObservableObject<DatacronsObservable> =
	observable<DatacronsObservable>({
		persistedData: getInitialDatacrons(),
		datacronByIdForActiveAllycode: () => {
			const allycode = profilesManagement$.activeProfile.allycode.get();
			return (
				datacrons$.persistedData[allycode]?.datacronById ??
				observable(new Map<string, Datacron>() as DatacronById)
			);
		},
		datacronByIdByAllycode: () => {
			return datacrons$.persistedData;
		},
		filteredDatacronsIdsForActiveAllycode: () => {
			const allycode = profilesManagement$.activeProfile.allycode.get();
			let datacrons =
				Array.from(
					datacrons$.persistedData[allycode]?.datacronById.get().values(),
				) || [];
			datacrons = filterDatacrons(datacrons$.filter.get(), datacrons);
			return datacrons.map((d) => d.id);
		},
		addProfile: (allycode: string) => {
			if (Object.hasOwn(datacrons$.datacronByIdByAllycode, allycode)) return;
			datacrons$.datacronByIdByAllycode[allycode].set({
				id: allycode,
				datacronById: new Map<string, Datacron>(),
			});
		},
		deleteProfile: (allycode: string) => {
			if (!Object.hasOwn(datacrons$.datacronByIdByAllycode, allycode)) return;
			datacrons$.datacronByIdByAllycode.allycode.delete();
		},
		availableDatacronSets: () => {
			const uniqueSetIds = new Set<number>();
			const datacronById = datacrons$.datacronByIdForActiveAllycode.get();
			for (const datacron of datacronById.values()) {
				uniqueSetIds.add(datacron.setId);
			}
			const SetsById = new Map<number, DatacronSet>();
			for (const setId of uniqueSetIds) {
				const stringSetId = `${setId}`;
				const set = (DatacronSets as Record<string, { displayName: string }>)[
					stringSetId
				];
				const name = set?.displayName || `${setId}`;
				SetsById.set(setId, { id: setId, name });
			}
			return SetsById;
		},
		availableAlignmentAbilities: () => {
			const abilities = [];
			const abilityIds = new Set<string>();

			const datacronIds =
				datacrons$.filteredDatacronsIdsForActiveAllycode.get();
			const datacronById = datacrons$.datacronByIdForActiveAllycode.get();

			for (const id of datacronIds) {
				const datacron = datacronById.get(id);
				if (!datacron) continue;

				const alignment = datacrons$.filter.alignment.get();

				if (
					alignment === undefined &&
					!abilityIds.has(datacron.affix[2]?.abilityId) &&
					datacron.affix[2]?.abilityId?.startsWith("datacron_alignment")
				) {
					abilityIds.add(datacron.affix[2]?.abilityId);
					abilities.push(datacron.affix[2]);
				}
			}
			return abilities;
		},
		availableCharacterAbilities: () => {
			const abilities = [];
			const abilityIds = new Set<string>();
			const datacronIds =
				datacrons$.filteredDatacronsIdsForActiveAllycode.get();
			const datacronById = datacrons$.datacronByIdForActiveAllycode.get();

			for (const id of datacronIds) {
				const datacron = datacronById.get(id);
				if (!datacron) continue;

				for (const affix of datacron.affix) {
					const affixData = findAffix(affix);
					if (
						affixData &&
						affix.abilityId.startsWith("datacron_character") &&
						!abilityIds.has(affix.abilityId)
					) {
						abilityIds.add(affix.abilityId);
						abilities.push(affix);
					}
				}
			}
			return abilities;
		},
		availableCharacters: () => {
			const characters = [];
			const characterIds = new Set<string>();
			const datacronIds =
				datacrons$.filteredDatacronsIdsForActiveAllycode.get();
			const datacronById = datacrons$.datacronByIdForActiveAllycode.get();

			for (const id of datacronIds) {
				const datacron = datacronById.get(id);
				if (!datacron) continue;

				for (const affix of datacron.affix) {
					const affixData = findAffix(affix);
					if (
						affixData &&
						affix.abilityId.startsWith("datacron_character") &&
						!characterIds.has(affixData.targetCharacter)
					) {
						characterIds.add(affixData.targetCharacter);
						characters.push(affix);
					}
				}
			}
			return characters;
		},
		availableFactionAbilities: () => {
			const abilities = [];
			const abilityIds = new Set<string>();
			const datacronIds =
				datacrons$.filteredDatacronsIdsForActiveAllycode.get();
			const datacronById = datacrons$.datacronByIdForActiveAllycode.get();

			for (const id of datacronIds) {
				const datacron = datacronById.get(id);
				if (!datacron) continue;

				for (const affix of datacron.affix) {
					const affixData = findAffix(affix);
					if (
						affixData &&
						(affix.abilityId.startsWith("datacron_faction") ||
							affix.abilityId.startsWith("datacron_role")) &&
						!abilityIds.has(affix.abilityId)
					) {
						abilityIds.add(affix.abilityId);
						abilities.push(affix);
					}
				}
			}
			return abilities;
		},
		availableFactions: () => {
			const abilities = [];
			const categories = new Set<string>();
			const datacronIds =
				datacrons$.filteredDatacronsIdsForActiveAllycode.get();
			const datacronById = datacrons$.datacronByIdForActiveAllycode.get();

			for (const id of datacronIds) {
				const datacron = datacronById.get(id);
				if (!datacron) continue;

				for (const affix of datacron.affix) {
					const affixData = findAffix(affix);
					if (
						affixData &&
						(affix.abilityId.startsWith("datacron_faction") ||
							affix.abilityId.startsWith("datacron_role")) &&
						!categories.has(affixData.targetCategory)
					) {
						categories.add(affixData.targetCategory);
						abilities.push(affix);
					}
				}
			}
			return abilities;
		},
		filter: {
			datacronSet: undefined,
			alignment: undefined,
			alignmentAbility: undefined,
			faction: undefined,
			factionAbility: undefined,
			character: undefined,
			characterAbility: undefined,
			focused: undefined,
			isNamed: undefined,
			name: undefined,
		},
		abilitiesDisplayMode: "Show Full Abilities",
		resetFilters: () => {
			datacrons$.filter.datacronSet.set(undefined);
			datacrons$.filter.alignment.set(undefined);
			datacrons$.filter.alignmentAbility.set(undefined);
			datacrons$.filter.faction.set(undefined);
			datacrons$.filter.factionAbility.set(undefined);
			datacrons$.filter.character.set(undefined);
			datacrons$.filter.characterAbility.set(undefined);
			datacrons$.filter.focused.set(undefined);
			datacrons$.filter.isNamed.set(undefined);
			datacrons$.filter.name.set(undefined);
		},
		reset: () => {
			syncStatus$.reset();
		},
	});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	datacrons$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		datacrons$.datacronByIdByAllycode.set({});
		return;
	}
	datacrons$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	datacrons$.persistedData,
	persistOptions({
		persist: {
			name: "Datacrons",
		},
		initial: getInitialDatacrons(),
	}),
);

export { datacrons$, syncStatus$ };
