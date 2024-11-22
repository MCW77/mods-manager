import { observable } from "@legendapp/state";

const stateLoader$ = observable({
	isDone: false,
	initialize: async () => {
		const { profilesManagement$ } = await import(
			"#/modules/profilesManagement/state/profilesManagement"
		);
		const { compilations$ } = await import(
			"#/modules/compilations/state/compilations"
		);
		const { characters$ } = await import(
			"#/modules/characters/state/characters"
		);
		const { charactersManagement$ } = await import(
			"#/modules/charactersManagement/state/charactersManagement"
		);
		const { about$ } = await import("#/modules/about/state/about");
		const { hotutils$ } = await import("#/modules/hotUtils/state/hotUtils");
		const { incrementalOptimization$ } = await import(
			"#/modules/incrementalOptimization/state/incrementalOptimization"
		);
		const { lockedStatus$ } = await import(
			"#/modules/lockedStatus/state/lockedStatus"
		);
		const { modsView$ } = await import("#/modules/modsView/state/modsView");
		const { optimizationSettings$ } = await import(
			"#/modules/optimizationSettings/state/optimizationSettings"
		);
		const { templates$ } = await import("#/modules/templates/state/templates");

		stateLoader$.isDone.set(true);
	},
});

export { stateLoader$ };
