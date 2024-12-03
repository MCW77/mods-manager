console.log("stateLoader 1");
import { observable } from "@legendapp/state";
// Dynamic imports at the top level
console.log("stateLoader 2");
const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
console.log("stateLoader 3");
const { compilations$ } = await import(
	"#/modules/compilations/state/compilations"
);
console.log("stateLoader 4");
const { characters$ } = await import("#/modules/characters/state/characters");
console.log("stateLoader 5");
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

const stateLoader$ = observable({
	isDone: true,
	profilesManagement$,
	compilations$,
	characters$,
	charactersManagement$,
	about$,
	hotutils$,
	incrementalOptimization$,
	lockedStatus$,
	modsView$,
	optimizationSettings$,
	templates$,
});

export { stateLoader$ };
