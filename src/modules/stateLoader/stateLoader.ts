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

export interface StateLoaderObservable {
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
			"#/modules/profilesManagement/state/profilesManagement"
		);
		stateLoader$.profilesManagement$.set(
			profilesManagementModule.profilesManagement$,
		);
		const compilationsModule = await import(
			"#/modules/compilations/state/compilations"
		);
		stateLoader$.compilations$.set(compilationsModule.compilations$);
		const charactersModule = await import(
			"#/modules/characters/state/characters"
		);
		stateLoader$.characters$.set(charactersModule.characters$);
		const charactersManagementModule = await import(
			"#/modules/charactersManagement/state/charactersManagement"
		);
		stateLoader$.charactersManagement$.set(
			charactersManagementModule.charactersManagement$,
		);
		const aboutModule = await import("#/modules/about/state/about");
		stateLoader$.about$.set(aboutModule.about$);
		const hotutilsModule = await import("#/modules/hotUtils/state/hotUtils");
		stateLoader$.hotutils$.set(hotutilsModule.hotutils$);
		const incrementalOptimizationModule = await import(
			"#/modules/incrementalOptimization/state/incrementalOptimization"
		);
		stateLoader$.incrementalOptimization$.set(
			incrementalOptimizationModule.incrementalOptimization$,
		);
		const lockedStatusModule = await import(
			"#/modules/lockedStatus/state/lockedStatus"
		);
		stateLoader$.lockedStatus$.set(lockedStatusModule.lockedStatus$);
		const modsViewModule = await import("#/modules/modsView/state/modsView");
		stateLoader$.modsView$.set(modsViewModule.modsView$);
		const optimizationSettingsModule = await import(
			"#/modules/optimizationSettings/state/optimizationSettings"
		);
		stateLoader$.optimizationSettings$.set(
			optimizationSettingsModule.optimizationSettings$,
		);
		const templatesModule = await import("#/modules/templates/state/templates");
		stateLoader$.templates$.set(templatesModule.templates$);
		stateLoader$.isDone.set(true);
	} catch (error) {
		console.error("Error during state loader initialization:", error);
	}
}

// Load state modules dynamically
await loadStateModules();

export { stateLoader$ };
