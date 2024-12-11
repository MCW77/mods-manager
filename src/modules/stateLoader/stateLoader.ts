import { observable, type ObservableObject } from "@legendapp/state";
import type { ProfilesManagement } from "#/modules/profilesManagement/domain/ProfilesManagement";
import type { CompilationsObservable } from "#/modules/compilations/domain/CompilationsObservable";
import type { CharactersObservable } from "#/modules/characters/domain/CharactersObservable";
import type { CharactersManagementObservable } from "#/modules/charactersManagement/domain/CharactersManagementObservable";
import type { AboutObservable } from "#/modules/about/domain/AboutObservable";
import type { HotutilsObservable } from "#/modules/hotUtils/domain/HotutilsObservable";
import type { IncrementalOptimizationObservable } from "#/modules/incrementalOptimization/domain/IncrementalOptimizationObservable";
import type { LockedStatusObservable } from "#/modules/lockedStatus/domain/LockedStatusObservable";
import type { ModsViewObservable } from "#/modules/modsView/domain/ModsViewObservable";
import type { OptimizationSettingsObservable } from "#/modules/optimizationSettings/domain/OptimizationSettingsObservable";
import type { TemplatesObservable } from "#/modules/templates/domain/TemplatesObservable";

const stateLoader$ = observable<{
	isDone: boolean;
	profilesManagement$: ObservableObject<ProfilesManagement> | null;
	compilations$: ObservableObject<CompilationsObservable> | null;
	characters$: ObservableObject<CharactersObservable> | null;
	charactersManagement$: ObservableObject<CharactersManagementObservable> | null;
	about$: ObservableObject<AboutObservable> | null;
	hotutils$: ObservableObject<HotutilsObservable> | null;
	incrementalOptimization$: ObservableObject<IncrementalOptimizationObservable> | null;
	lockedStatus$: ObservableObject<LockedStatusObservable> | null;
	modsView$: ObservableObject<ModsViewObservable> | null;
	optimizationSettings$: ObservableObject<OptimizationSettingsObservable> | null;
	templates$: ObservableObject<TemplatesObservable> | null;
}>({
	isDone: false,
	profilesManagement$: null,
	compilations$: null,
	characters$: null,
	charactersManagement$: null,
	about$: null,
	hotutils$: null,
	incrementalOptimization$: null,
	lockedStatus$: null,
	modsView$: null,
	optimizationSettings$: null,
	templates$: null,
});

async function loadStateModules() {
	debugger;
	try {
		console.log("Starting state loader initialization");

		const profilesManagementModule = await import(
			"#/modules/profilesManagement/state/profilesManagement"
		);
		stateLoader$.profilesManagement$.set(
			profilesManagementModule.profilesManagement$,
		);
		console.log("profilesManagement$ loaded");

		const compilationsModule = await import(
			"#/modules/compilations/state/compilations"
		);
		stateLoader$.compilations$.set(compilationsModule.compilations$);
		console.log("compilations$ loaded");

		const charactersModule = await import(
			"#/modules/characters/state/characters"
		);
		stateLoader$.characters$.set(charactersModule.characters$);
		console.log("characters$ loaded");

		const charactersManagementModule = await import(
			"#/modules/charactersManagement/state/charactersManagement"
		);
		stateLoader$.charactersManagement$.set(
			charactersManagementModule.charactersManagement$,
		);
		console.log("charactersManagement$ loaded");

		const aboutModule = await import("#/modules/about/state/about");
		stateLoader$.about$.set(aboutModule.about$);
		console.log("about$ loaded");

		const hotutilsModule = await import("#/modules/hotUtils/state/hotUtils");
		stateLoader$.hotutils$.set(hotutilsModule.hotutils$);
		console.log("hotutils$ loaded");

		const incrementalOptimizationModule = await import(
			"#/modules/incrementalOptimization/state/incrementalOptimization"
		);
		stateLoader$.incrementalOptimization$.set(
			incrementalOptimizationModule.incrementalOptimization$,
		);
		console.log("incrementalOptimization$ loaded");

		const lockedStatusModule = await import(
			"#/modules/lockedStatus/state/lockedStatus"
		);
		stateLoader$.lockedStatus$.set(lockedStatusModule.lockedStatus$);
		console.log("lockedStatus$ loaded");

		const modsViewModule = await import("#/modules/modsView/state/modsView");
		stateLoader$.modsView$.set(modsViewModule.modsView$);
		console.log("modsView$ loaded");

		const optimizationSettingsModule = await import(
			"#/modules/optimizationSettings/state/optimizationSettings"
		);
		stateLoader$.optimizationSettings$.set(
			optimizationSettingsModule.optimizationSettings$,
		);
		console.log("optimizationSettings$ loaded");

		const templatesModule = await import("#/modules/templates/state/templates");
		stateLoader$.templates$.set(templatesModule.templates$);
		console.log("templates$ loaded");

		stateLoader$.isDone.set(true);
		console.log("State loader initialization complete");
	} catch (error) {
		console.error("Error during state loader initialization:", error);
	}
}

// Load state modules dynamically
debugger;
await loadStateModules();

export { stateLoader$ };
