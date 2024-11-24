import {
	beginBatch,
	endBatch,
	type Observable,
	observable,
	type ObservableObject,
} from "@legendapp/state";
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

interface StateLoader {
	isDone: boolean;
	profilesManagement$: ObservableObject<ProfilesManagement> | null;
	compilations$: ObservableObject<CompilationsObservable> | null;
	characters$: Observable<CharactersObservable> | null;
	charactersManagement$: ObservableObject<CharactersManagementObservable> | null;
	about$: ObservableObject<AboutObservable> | null;
	hotutils$: ObservableObject<HotutilsObservable> | null;
	incrementalOptimization$: ObservableObject<IncrementalOptimizationObservable> | null;
	lockedStatus$: ObservableObject<LockedStatusObservable> | null;
	modsView$: ObservableObject<ModsViewObservable> | null;
	optimizationSettings$: ObservableObject<OptimizationSettingsObservable> | null;
	templates$: ObservableObject<TemplatesObservable> | null;
	initialize: () => Promise<void>;
}
const stateLoader$ = observable<StateLoader>({
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

		beginBatch();
		stateLoader$.profilesManagement$.set(profilesManagement$);
		stateLoader$.compilations$.set(compilations$);
		stateLoader$.characters$.set(characters$);
		stateLoader$.charactersManagement$.set(charactersManagement$);
		stateLoader$.about$.set(about$);
		stateLoader$.hotutils$.set(hotutils$);
		stateLoader$.incrementalOptimization$.set(incrementalOptimization$);
		stateLoader$.lockedStatus$.set(lockedStatus$);
		stateLoader$.modsView$.set(modsView$);
		stateLoader$.optimizationSettings$.set(optimizationSettings$);
		stateLoader$.templates$.set(templates$);
		stateLoader$.isDone.set(true);
		endBatch();
	},
});

export { stateLoader$ };
