import { observable } from "@legendapp/state";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const lockedStatus$ = stateLoader$.lockedStatus$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;

const compilationsForActivePlayer$ =
	compilations$.compilationByIdForActiveAllycode;

const reoptimizationNeeded$ = observable({
	forLockedCharacters: false,
	forProfileUpdated: false,
	forOptimizationSettingsByCompilationId: new Map<string, boolean>(
		[...compilationsForActivePlayer$.keys()].map((key) => [key, false]),
	),
	handleChanges: () => {
		const forLockedCharacters =
			reoptimizationNeeded$.forLockedCharacters.peek();
		const forProfileUpdated = reoptimizationNeeded$.forProfileUpdated.peek();
		for (const [compilationId] of compilationsForActivePlayer$.peek()) {
			const forOptimizationSettings =
				reoptimizationNeeded$.forOptimizationSettingsByCompilationId
					.get(compilationId)
					.get();

			compilations$.compilationByIdForActiveAllycode[
				compilationId
			].isReoptimizationNeeded.set(
				forLockedCharacters || forOptimizationSettings || forProfileUpdated,
			);
		}
		const forOptimizationSettings =
			reoptimizationNeeded$.forOptimizationSettingsByCompilationId
				.get("DefaultCompilation")
				.get();
		compilations$.defaultCompilation.isReoptimizationNeeded.set(
			forLockedCharacters || forOptimizationSettings || forProfileUpdated,
		);

		reoptimizationNeeded$.forLockedCharacters.set(false);
		reoptimizationNeeded$.forProfileUpdated.set(false);
	},
});

lockedStatus$.lockedCharactersForActivePlayer.onChange(
	() => {
		reoptimizationNeeded$.forLockedCharacters.set(true);
		reoptimizationNeeded$.handleChanges();
	},
	{
		immediate: true,
		trackingType: undefined,
	},
);

optimizationSettings$.activeSettings.onChange(({ value }) => {
	const compilationsForActivePlayer$ =
		compilations$.compilationByIdForActiveAllycode;
	for (const [
		compilationId,
		compilation,
	] of compilationsForActivePlayer$.peek()) {
		const compilationSettings = compilation.optimizationConditions;
		const isDifferent =
			JSON.stringify(compilationSettings) !== JSON.stringify(value);
		if (isDifferent) {
			reoptimizationNeeded$.forOptimizationSettingsByCompilationId
				.get(compilationId)
				.set(true);
		} else {
			reoptimizationNeeded$.forOptimizationSettingsByCompilationId
				.get(compilationId)
				.set(false);
		}
	}
	const defaultCompilationsSettings =
		compilations$.defaultCompilation.optimizationConditions?.peek();
	const isDifferent =
		JSON.stringify(defaultCompilationsSettings) !== JSON.stringify(value);
	if (isDifferent) {
		reoptimizationNeeded$.forOptimizationSettingsByCompilationId
			.get(compilations$.defaultCompilation.id.peek())
			.set(true);
	} else {
		reoptimizationNeeded$.forOptimizationSettingsByCompilationId
			.get(compilations$.defaultCompilation.id.peek())
			.set(false);
	}
	reoptimizationNeeded$.handleChanges();
});

profilesManagement$.activeProfile.modById.onChange(() => {
	reoptimizationNeeded$.forProfileUpdated.set(true);
	reoptimizationNeeded$.handleChanges();
});

profilesManagement$.activeProfile.characterById.onChange(() => {
	reoptimizationNeeded$.forProfileUpdated.set(true);
	reoptimizationNeeded$.handleChanges();
});
