console.log("stateLoader 1");
import { observable, type ObservableObject } from "@legendapp/state";
import type { ProfilesManagement } from "../profilesManagement/domain/ProfilesManagement";
import type { CompilationsObservable } from "../compilations/domain/CompilationsObservable";
import type { CharactersObservable } from "../characters/domain/CharactersObservable";
import type { CharactersManagementObservable } from "../charactersManagement/domain/CharactersManagementObservable";
import type { AboutObservable } from "../about/domain/AboutObservable";
import type { HotutilsObservable } from "../hotUtils/domain/HotutilsObservable";
import type { IncrementalOptimizationObservable } from "../incrementalOptimization/domain/IncrementalOptimizationObservable";
import type { LockedStatusObservable } from "../lockedStatus/domain/LockedStatusObservable";
import type { ModsViewObservable } from "../modsView/domain/ModsViewObservable";
import type { OptimizationSettingsObservable } from "../optimizationSettings/domain/OptimizationSettingsObservable";
import type { TemplatesObservable } from "../templates/domain/TemplatesObservable";
// Dynamic imports at the top level
let profilesManagement$: ObservableObject<ProfilesManagement>;
let compilations$: ObservableObject<CompilationsObservable>;
let characters$: ObservableObject<CharactersObservable>;
let charactersManagement$: ObservableObject<CharactersManagementObservable>;
let about$: ObservableObject<AboutObservable>;
let hotutils$: ObservableObject<HotutilsObservable>;
let incrementalOptimization$: ObservableObject<IncrementalOptimizationObservable>;
let lockedStatus$: ObservableObject<LockedStatusObservable>;
let modsView$: ObservableObject<ModsViewObservable>;
let optimizationSettings$: ObservableObject<OptimizationSettingsObservable>;
let templates$: ObservableObject<TemplatesObservable>;

const stateLoader$ = observable<{
	isDone: boolean;
	profilesManagement$: ObservableObject<ProfilesManagement>;
	compilations$: ObservableObject<CompilationsObservable>;
	characters$: ObservableObject<CharactersObservable>;
	charactersManagement$: ObservableObject<CharactersManagementObservable>;
	about$: ObservableObject<AboutObservable>;
	hotutils$: ObservableObject<HotutilsObservable>;
	incrementalOptimization$: ObservableObject<IncrementalOptimizationObservable>;
	lockedStatus$: ObservableObject<LockedStatusObservable>;
	modsView$: ObservableObject<ModsViewObservable>;
	optimizationSettings$: ObservableObject<OptimizationSettingsObservable>;
	templates$: ObservableObject<TemplatesObservable>;
}>();
Promise.all([
	await import("#/modules/profilesManagement/state/profilesManagement")
		.then((module) => {
			profilesManagement$ = module.profilesManagement$;
			stateLoader$.profilesManagement$.set(module.profilesManagement$);
			console.log("profilesManagement$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/compilations/state/compilations")
		.then((module) => {
			compilations$ = module.compilations$;
			stateLoader$.compilations$.set(module.compilations$);
			console.log("compilations$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/characters/state/characters")
		.then((module) => {
			characters$ = module.characters$;
			stateLoader$.characters$.set(module.characters$);
			console.log("characters$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/charactersManagement/state/charactersManagement")
		.then((module) => {
			charactersManagement$ = module.charactersManagement$;
			stateLoader$.charactersManagement$.set(module.charactersManagement$);
			console.log("charactersManagement$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/about/state/about")
		.then((module) => {
			about$ = module.about$;
			stateLoader$.about$.set(module.about$);
			console.log("about$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/hotUtils/state/hotUtils")
		.then((module) => {
			hotutils$ = module.hotutils$;
			stateLoader$.hotutils$.set(module.hotutils$);
			console.log("hotutils$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import(
		"#/modules/incrementalOptimization/state/incrementalOptimization"
	)
		.then((module) => {
			incrementalOptimization$ = module.incrementalOptimization$;
			stateLoader$.incrementalOptimization$.set(
				module.incrementalOptimization$,
			);
			console.log("incrementalOptimization$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/lockedStatus/state/lockedStatus")
		.then((module) => {
			lockedStatus$ = module.lockedStatus$;
			stateLoader$.lockedStatus$.set(module.lockedStatus$);
			console.log("lockedStatus$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/modsView/state/modsView")
		.then((module) => {
			modsView$ = module.modsView$;
			stateLoader$.modsView$.set(module.modsView$);
			console.log("modsView$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/optimizationSettings/state/optimizationSettings")
		.then((module) => {
			optimizationSettings$ = module.optimizationSettings$;
			stateLoader$.optimizationSettings$.set(module.optimizationSettings$);
			console.log("optimizationSettings$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
	await import("#/modules/templates/state/templates")
		.then((module) => {
			templates$ = module.templates$;
			stateLoader$.templates$.set(module.templates$);
			console.log("templates$ loaded");
			return module;
		})
		.catch((e) => {
			console.error(e);
		}),
]).then(() => {
	stateLoader$.set({
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
});

export { stateLoader$ };
