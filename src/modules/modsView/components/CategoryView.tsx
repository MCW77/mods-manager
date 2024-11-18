// react
import type React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// hooks
import { useRenderCount } from "#/hooks/useRenderCount";

// domain
import { ModsFilter } from "../domain/ModsFilter";

// components
import { GroupedMods } from "#/modules/modsView/components/GroupedMods";

const CategoryView: React.FC = observer(() => {
	useRenderCount(`CategoryView (${modsView$.activeCategory.peek()})`);
	const [t] = useTranslation("global-ui");
	const modById = profilesManagement$.activeProfile.modById.get();
	const modsFilter = new ModsFilter(
		modsView$.activeViewSetupInActiveCategory.get(),
		modsView$.quickFilter.get(),
	);
	const [filteredMods, modsCount] =
		modsFilter.applyModsViewOptions(Array.from(modById.values()));

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

export { CategoryView };
