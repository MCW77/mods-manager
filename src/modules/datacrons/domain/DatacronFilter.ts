import { findAffix } from "../utils/findAffix";
import type { Datacron } from "./Datacrons";

interface DatacronSet {
	id: number;
	name: string;
}

interface DatacronFilter {
	datacronSet: number | undefined;
	alignment: "lightside" | "darkside" | undefined;
	alignmentAbility: string | undefined;
	faction: string | undefined;
	factionAbility: string | undefined;
	character: string | undefined;
	characterAbility: string | undefined;
	focused: boolean | undefined;
	name: string | undefined;
}

type DatacronFilterPredicate = (datacron: Datacron) => boolean;

const combineFilters: (
	filters: DatacronFilterPredicate[],
) => DatacronFilterPredicate = (filters) => (item: Datacron) => {
	return filters.map((filter) => filter(item)).every((x) => x === true);
};

function filterDatacrons(
	filter: DatacronFilter,
	datacrons: Datacron[],
): Datacron[] {
	const filters = [];
	if (filter.datacronSet !== undefined) {
		filters.push((datacron: Datacron) => datacron.setId === filter.datacronSet);
	}
	if (filter.alignment !== undefined) {
		filters.push((datacron: Datacron) => {
			if (datacron.affix.length < 3 || filter.alignment === undefined)
				return false;
			const affixData = findAffix(datacron.affix[2]);
			if (!affixData) return false;
			return (
				datacron.affix[2].abilityId.startsWith("datacron_alignment") &&
				affixData.tag.includes(filter.alignment)
			);
		});
	}
	if (filter.alignmentAbility !== undefined) {
		filters.push(
			(datacron: Datacron) =>
				datacron.affix[2]?.abilityId === filter.alignmentAbility,
		);
	}
	if (filter.faction !== undefined) {
		filters.push((datacron: Datacron) => {
			for (const affix of datacron.affix) {
				const affixData = findAffix(affix);
				if (
					(affix.abilityId.startsWith("datacron_faction") ||
						affix.abilityId.startsWith("datacron_role")) &&
					affixData?.targetCategory === filter.faction
				) {
					return true;
				}
			}
			return false;
		});
	}
	if (filter.factionAbility !== undefined) {
		filters.push((datacron: Datacron) => {
			for (const affix of datacron.affix) {
				if (affix.abilityId === filter.factionAbility) {
					return true;
				}
			}
			return false;
		});
	}
	if (filter.character !== undefined) {
		filters.push((datacron: Datacron) => {
			for (const affix of datacron.affix) {
				const affixData = findAffix(affix);
				if (
					affix.abilityId.startsWith("datacron_character") &&
					affixData?.targetCharacter === filter.character
				) {
					return true;
				}
			}
			return false;
		});
	}
	if (filter.characterAbility !== undefined) {
		filters.push((datacron: Datacron) => {
			for (const affix of datacron.affix) {
				if (affix.abilityId === filter.characterAbility) {
					return true;
				}
			}
			return false;
		});
	}
	if (filter.focused !== undefined) {
		filters.push((datacron: Datacron) => datacron.focused === filter.focused);
	}
	if (filter.name !== undefined) {
		filters.push((datacron: Datacron) =>
			datacron.name.toLowerCase().includes(filter.name?.toLowerCase() || ""),
		);
	}
	return datacrons.filter(combineFilters(filters));
}

export { type DatacronFilter, type DatacronSet, filterDatacrons };
