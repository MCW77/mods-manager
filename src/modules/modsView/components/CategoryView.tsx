// react
import type React from "react";
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { observer, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const modsView$ = stateLoader$.modsView$;

// hooks
import { useRenderCount } from "#/hooks/useRenderCount";

// domain
import { ModsFilter } from "../domain/ModsFilter";

// components
const GroupedMods = lazy(() => import("./GroupedMods"));

const CategoryView: React.FC = observer(() => {
	useRenderCount(`CategoryView (${modsView$.activeCategory.peek()})`);
	const [t] = useTranslation("global-ui");
	const modById = use$(profilesManagement$.activeProfile.modById);
	const activeViewSetupInActiveCategory = use$(
		modsView$.activeViewSetupInActiveCategory,
	);
	const quickFilter = use$(modsView$.quickFilter);
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
