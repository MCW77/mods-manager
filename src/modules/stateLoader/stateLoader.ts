import { observable, type ObservableObject, when } from "@legendapp/state";
import type { ProfilesManagementObservable } from "#/modules/profilesManagement/domain/ProfilesManagement";
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
import type { DatacronsObservable } from "#/modules/datacrons/domain/DatacronsObservable";
import type { MaterialsObservable } from "#/modules/materials/domain/MaterialsObservable";
import type { CurrenciesObservable } from "#/modules/currencies/domain/CurrenciesObservable";
import type { StackRankObservable } from "#/modules/stackRank/domain/StackRankObservable";

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
	datacrons$: ObservableObject<DatacronsObservable> | null;
	materials$: ObservableObject<MaterialsObservable> | null;
	currencies$: ObservableObject<CurrenciesObservable> | null;
	stackRank$: ObservableObject<StackRankObservable> | null;
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
	datacrons$: null,
	materials$: null,
	currencies$: null,
	stackRank$: null,
});

async function loadStateModules() {
	try {
		const [
			profilesManagementModule,
			compilationsModule,
			charactersModule,
			charactersManagementModule,
			aboutModule,
			hotutilsModule,
			incrementalOptimizationModule,
			lockedStatusModule,
			modsViewModule,
			optimizationSettingsModule,
			templatesModule,
			datacronsModule,
			materialsModule,
			currenciesModule,
			stackRankModule,
		] = await Promise.all([
			import("#/modules/profilesManagement/state/profilesManagement"),
			import("#/modules/compilations/state/compilations"),
			import("#/modules/characters/state/characters"),
			import("#/modules/charactersManagement/state/charactersManagement"),
			import("#/modules/about/state/about"),
			import("#/modules/hotUtils/state/hotUtils"),
			import("#/modules/incrementalOptimization/state/incrementalOptimization"),
			import("#/modules/lockedStatus/state/lockedStatus"),
			import("#/modules/modsView/state/modsView"),
			import("#/modules/optimizationSettings/state/optimizationSettings"),
			import("#/modules/templates/state/templates"),
			import("#/modules/datacrons/state/datacrons"),
			import("#/modules/materials/state/materials"),
			import("#/modules/currencies/state/currencies"),
			import("#/modules/stackRank/state/stackRank"),
		]);

		stateLoader$.profilesManagement$.set(
			profilesManagementModule.profilesManagement$,
		);
		stateLoader$.compilations$.set(compilationsModule.compilations$);
		stateLoader$.characters$.set(charactersModule.characters$);
		stateLoader$.charactersManagement$.set(
			charactersManagementModule.charactersManagement$,
		);
		stateLoader$.about$.set(aboutModule.about$);
		stateLoader$.hotutils$.set(hotutilsModule.hotutils$);
		stateLoader$.incrementalOptimization$.set(
			incrementalOptimizationModule.incrementalOptimization$,
		);
		stateLoader$.lockedStatus$.set(lockedStatusModule.lockedStatus$);
		stateLoader$.modsView$.set(modsViewModule.modsView$);
		stateLoader$.optimizationSettings$.set(
			optimizationSettingsModule.optimizationSettings$,
		);
		stateLoader$.templates$.set(templatesModule.templates$);
		stateLoader$.datacrons$.set(datacronsModule.datacrons$);
		stateLoader$.materials$.set(materialsModule.materials$);
		stateLoader$.currencies$.set(currenciesModule.currencies$);
		stateLoader$.stackRank$.set(stackRankModule.stackRank$);
		await Promise.all([
			when(profilesManagementModule.syncStatus$.isPersistLoaded),
			when(compilationsModule.syncStatus$.isPersistLoaded),
			when(compilationsModule.syncStatus2$.isPersistLoaded),
			when(charactersModule.syncStatus$.isPersistLoaded),
			when(charactersManagementModule.syncStatus$.isPersistLoaded),
			when(aboutModule.syncStatus$.isPersistLoaded),
			when(hotutilsModule.syncStatus$.isPersistLoaded),
			when(incrementalOptimizationModule.syncStatus$.isPersistLoaded),
			when(lockedStatusModule.syncStatus$.isPersistLoaded),
			when(modsViewModule.syncStatus$.isPersistLoaded),
			when(optimizationSettingsModule.syncStatus$.isPersistLoaded),
			when(templatesModule.templatesSyncStatus$.isPersistLoaded),
			when(templatesModule.templatesAddingModeSyncStatus$.isPersistLoaded),
			when(datacronsModule.syncStatus$.isPersistLoaded),
			when(materialsModule.syncStatus$.isPersistLoaded),
			when(currenciesModule.syncStatus$.isPersistLoaded),
			when(stackRankModule.syncStatus$.isPersistLoaded),
		]);

		stateLoader$.isDone.set(true);
	} catch (error) {
		console.error("Error during state loader initialization:", error);
	}
}

loadStateModules();

export { stateLoader$ };
