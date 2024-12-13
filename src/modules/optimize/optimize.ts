// state
import { beginBatch, endBatch } from "@legendapp/state";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const lockedStatus$ = stateLoader$.lockedStatus$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;

import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { progress$ } from "#/modules/progress/state/progress";
import { review$ } from "#/modules/review/state/review";

// domain
import type { FlatCharacterModdings } from "#/modules/compilations/domain/CharacterModdings";
import {
	type OptimizationConditions,
	createOptimizationConditions,
} from "#/modules/compilations/domain/OptimizationConditions";

// const OptimizerWorker = await import("#/workers/optimizer?worker");

let optimizationWorker: Worker | null = null;

export function cancelOptimizer(): void {
	optimizationWorker?.terminate();
	progress$.finish();
}

/**
 * Take the results of the mod optimization and apply them to the current profile
 * @param result {Object} The result from the optimizer
 * @param settings {OptimizerRun} The previous settings that were used to get this result
 * @returns {*}
 */
const finishModOptimization = (
	result: FlatCharacterModdings,
	settings: OptimizationConditions,
) => {
	compilations$.defaultCompilation.hasSelectionChanged.set(false);
	compilations$.defaultCompilation.flatCharacterModdings.set(result);
	compilations$.defaultCompilation.optimizationConditions.set(settings);
	compilations$.defaultCompilation.lastOptimized.set(new Date());

	// If this was an incremental optimization, leave the user on their current page
	if (
		incrementalOptimization$.indicesByProfile[
			profilesManagement$.profiles.activeAllycode.peek()
		].peek() !== null
	) {
		return true;
	}

	review$.modListFilter.view.set("sets");
	review$.modListFilter.sort.set("assignedCharacter");

	optimizerView$.view.set("review");

	// Create the content of the pop-up for any post-optimization messages

	const resultsWithMessages = result
		.filter((x) => null !== x)
		.filter(
			({ messages, missedGoals }) =>
				0 < (messages?.length ?? 0) || 0 < missedGoals.length,
		);

	if (resultsWithMessages.length) {
		const baseCharacterById = characters$.baseCharacterById.peek();
		const doubledResultsWithMessages = [];
		for (const item of resultsWithMessages) {
			doubledResultsWithMessages.push(item);
			doubledResultsWithMessages.push(item);
		}
		progress$.setPostOptimizationMessages(doubledResultsWithMessages);
	}
	return true;
};

/**
 * Run the optimization algorithm and update the player's profile with the results
 */
export function optimizeMods(): void {
	progress$.init();
	const allycode = profilesManagement$.profiles.activeAllycode.peek();

	// If any of the characters being optimized don't have stats, then show an error message
	if (
		Object.values(profilesManagement$.activeProfile.characterById.peek()).some(
			(character) => {
				return (
					null === character.playerValues.baseStats ||
					null === character.playerValues.equippedStats
				);
			},
		)
	) {
		progress$.abort();
		return;
	}

	optimizationWorker = new Worker(
		new URL("../../workers/optimizer.ts", import.meta.url),
		{ type: "module" },
	);
	optimizationWorker.postMessage({
		type: "Init",
	});

	optimizationWorker.onerror = (errorEvent) => {
		errorEvent.preventDefault();
		console.log(errorEvent.message);
		optimizationWorker?.terminate();
		progress$.errorAbort(new Error(errorEvent.message));
	};

	optimizationWorker.onmessage = (message) => {
		switch (message.data.type) {
			case "OptimizationSuccess":
				finishModOptimization(
					message.data.result,
					createOptimizationConditions(
						profilesManagement$.activeProfile.characterById.peek(),
						lockedStatus$.ofActivePlayerByCharacterId.peek(),
						profilesManagement$.activeProfile.modById.size,
						compilations$.defaultCompilation.selectedCharacters.peek(),
						optimizationSettings$.settingsByProfile[
							profilesManagement$.profiles.activeAllycode.peek()
						].peek(),
					),
				);
				progress$.finish();
				break;
			case "Progress":
				beginBatch();
				progress$.optimizationStatus.character.set(message.data.character);
				progress$.optimizationStatus.characterCount.set(
					message.data.characterCount,
				);
				progress$.optimizationStatus.characterIndex.set(
					message.data.characterIndex,
				);
				progress$.optimizationStatus.message.set(message.data.step);
				progress$.optimizationStatus.progress.set(message.data.progress);
				progress$.optimizationStatus.sets.set([]);
				progress$.optimizationStatus.setsCount.set(message.data.setsCount);
				progress$.optimizationStatus.setsIndex.set(message.data.setsIndex);
				progress$.optimizationStatus.targetStat.set(message.data.targetStat);
				progress$.optimizationStatus.targetStatCount.set(
					message.data.targetStatCount,
				);
				progress$.optimizationStatus.targetStatIndex.set(
					message.data.targetStatIndex,
				);
				endBatch();
				break;
			case "Ready":
				optimizationWorker?.postMessage({
					type: "Optimize",
				});
				break;
			default:
			// Do nothing
		}
	};
}
