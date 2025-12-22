// react
import type React from "react";

// state
import { observer, useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const modsView$ = stateLoader$.modsView$;

// domain
import { ModsFilter } from "../domain/ModsFilter";

// components
import GroupedMods from "./GroupedMods";

const CategoryView: React.FC = observer(() => {
	const modById = useValue(profilesManagement$.activeProfile.modById);
	const activeViewSetupInActiveCategory = useValue(
		modsView$.activeViewSetupInActiveCategory,
	);
	const quickFilter = useValue(modsView$.quickFilter);
	const modsFilter = new ModsFilter(
		activeViewSetupInActiveCategory,
		quickFilter,
	);
	const [filteredMods, modsCount] = modsFilter.applyModsViewOptions(
		Array.from(modById.values()),
	);

	const mods = [];
	for (const modsInGroup of Object.values(filteredMods)) {
		if (modsInGroup.length > 0) mods.push(modsInGroup);
	}
	const groupedMods = mods.sort((mods1, mods2) => mods1.length - mods2.length);

	return (
		<GroupedMods
			groupedMods={groupedMods}
			allModsCount={modById.size}
			displayedModsCount={modsCount}
		/>
	);
});

CategoryView.displayName = "CategoryView";

export default CategoryView;
