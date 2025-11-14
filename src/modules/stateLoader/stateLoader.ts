import { observable, type ObservableObject } from "@legendapp/state";
import type { ProfilesManagementObservable } from "#/modules/profilesManagement/domain/ProfilesManagement.js";
import type { CompilationsObservable } from "#/modules/compilations/domain/CompilationsObservable.js";
import type { CharactersObservable } from "#/modules/characters/domain/CharactersObservable.js";
import type { CharactersManagementObservable } from "#/modules/charactersManagement/domain/CharactersManagementObservable.js";
import type { AboutObservable } from "#/modules/about/domain/AboutObservable.js";
import type { HotutilsObservable } from "#/modules/hotUtils/domain/HotutilsObservable.js";
import type { IncrementalOptimizationObservable } from "#/modules/incrementalOptimization/domain/IncrementalOptimizationObservable.js";
import type { LockedStatusObservable } from "#/modules/lockedStatus/domain/LockedStatusObservable.js";
import type { ModsViewObservable } from "#/modules/modsView/domain/ModsViewObservable.js";
import type { OptimizationSettingsObservable } from "#/modules/optimizationSettings/domain/OptimizationSettingsObservable.js";
import type { TemplatesObservable } from "#/modules/templates/domain/TemplatesObservable.js";

export interface StateLoaderObservable {
	isDone: boolean;
	profilesManagement$: ObservableObject<ProfilesManagementObservable> | null;
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
}
const stateLoader$ = observable<StateLoaderObservable>({
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
	try {
		const profilesManagementModule = await import(
			"#/modules/profilesManagement/state/profilesManagement.js"
		);
		stateLoader$.profilesManagement$.set(
			profilesManagementModule.profilesManagement$,
		);
		const compilationsModule = await import(
			"#/modules/compilations/state/compilations.js"
		);
		stateLoader$.compilations$.set(compilationsModule.compilations$);
		const charactersModule = await import(
			"#/modules/characters/state/characters.js"
		);
		stateLoader$.characters$.set(charactersModule.characters$);
		const charactersManagementModule = await import(
			"#/modules/charactersManagement/state/charactersManagement.js"
		);
		stateLoader$.charactersManagement$.set(
			charactersManagementModule.charactersManagement$,
		);
		const aboutModule = await import("#/modules/about/state/about.js");
		stateLoader$.about$.set(aboutModule.about$);
		const hotutilsModule = await import("#/modules/hotUtils/state/hotUtils.js");
		stateLoader$.hotutils$.set(hotutilsModule.hotutils$);
		const incrementalOptimizationModule = await import(
			"#/modules/incrementalOptimization/state/incrementalOptimization.js"
		);
		stateLoader$.incrementalOptimization$.set(
			incrementalOptimizationModule.incrementalOptimization$,
		);
		const lockedStatusModule = await import(
			"#/modules/lockedStatus/state/lockedStatus.js"
		);
		stateLoader$.lockedStatus$.set(lockedStatusModule.lockedStatus$);
		const modsViewModule = await import("#/modules/modsView/state/modsView.js");
		stateLoader$.modsView$.set(modsViewModule.modsView$);
		const optimizationSettingsModule = await import(
			"#/modules/optimizationSettings/state/optimizationSettings.js"
		);
		stateLoader$.optimizationSettings$.set(
			optimizationSettingsModule.optimizationSettings$,
		);
		const templatesModule = await import(
			"#/modules/templates/state/templates.js"
		);
		stateLoader$.templates$.set(templatesModule.templates$);
		stateLoader$.isDone.set(true);
	} catch (error) {
		console.error("Error during state loader initialization:", error);
	}
}

// Load state modules dynamically
await loadStateModules();

export { stateLoader$ };
