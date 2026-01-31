// react
import type React from "react";

// state
import { observer, useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const modsView$ = stateLoader$.modsView$;

// components
import GroupedMods from "./GroupedMods";

const CategoryView: React.FC = observer(() => {
	// Start performance measurement
	performance.mark("mods-filter-start");

	const modById = useValue(profilesManagement$.activeProfile.modById);

	// Use the new computed observables
	const transformedMods = useValue(modsView$.transformedMods);
	const modsCount = useValue(modsView$.modsCount);

	// End performance measurement
	performance.mark("mods-filter-end");
	performance.measure(
		"mods-filter-total",
		"mods-filter-start",
		"mods-filter-end",
	);
	const measure = performance.getEntriesByName("mods-filter-total")[0];
	console.log(
		`[perf-mods] Filter/Group/Sort: ${measure.duration.toFixed(2)}ms`,
	);
	performance.clearMarks();
	performance.clearMeasures();

	return (
		<GroupedMods
			groupedMods={transformedMods}
			allModsCount={modById.size}
			displayedModsCount={modsCount}
		/>
	);
});

CategoryView.displayName = "CategoryView";

export default CategoryView;
