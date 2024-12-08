// react
import { lazy } from "react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const lockedStatus$ = stateLoader$.lockedStatus$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;

import { dialog$ } from "#/modules/dialog/state/dialog";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { progress$ } from "#/modules/progress/state/progress";
import { review$ } from "#/modules/review/state/review";

// domain
/*
import * as Character from "#/domain/Character";

import type { FlatCharacterModdings } from "#/modules/compilations/domain/CharacterModdings";
import {
	type OptimizationConditions,
	createOptimizationConditions,
} from "#/modules/compilations/domain/OptimizationConditions";
*/
// components
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar"),
);

import { Button } from "#ui/button";
import { DialogClose } from "#ui/dialog";

// const OptimizerWorker = await import("#/workers/optimizer?worker");

//let optimizationWorker: Worker | null = null;

export function cancelOptimizer(): void {
	/*
	optimizationWorker?.terminate();
	progress$.optimizationStatus.assign({
		character: "",
		characterCount: 0,
		characterIndex: 0,
		message: "",
		progress: 0,
	});
	*/
}

/**
 * Take the results of the mod optimization and apply them to the current profile
 * @param result {Object} The result from the optimizer
 * @param settings {OptimizerRun} The previous settings that were used to get this result
 * @returns {*}
 */
/*
const finishModOptimization = (
	result: FlatCharacterModdings,
	settings: OptimizationConditions,
) => {
	isBusy$.set(true);
	compilations$.defaultCompilation.hasSelectionChanged.set(false);
	compilations$.defaultCompilation.flatCharacterModdings.set(result);
	compilations$.defaultCompilation.optimizationConditions.set(settings);
	compilations$.defaultCompilation.lastOptimized.set(new Date());
	isBusy$.set(false);
	progress$.optimizationStatus.assign({
		character: "",
		characterCount: 0,
		characterIndex: 0,
		message: "",
		progress: 0,
	});

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

	dialog$.hide();
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

		dialog$.show(
			<div className={"flex flex-col flex-gap-2"}>
				<h3 className={"text-center"}>
					Important messages regarding your selected targets
				</h3>
				<div className="flex items-center justify-center h-[75vh] px-4 md:px-6">
					<div className="w-full max-w-4xl border rounded-lg">
						<div className="grid w-full grid-cols-[1fr_1fr] border-b">
							<div className="grid gap-1 p-4">
								<div className="text-sm font-medium tracking-wide">
									Character
								</div>
							</div>
							<div className="grid gap-1 p-4">
								<div className="text-sm font-medium tracking-wide">
									Messages
								</div>
							</div>
						</div>
						<div className="h-[70vh] overflow-auto">
							<div className="grid w-full grid-cols-[1fr_1fr]">
								{doubledResultsWithMessages.map(
									(
										{ characterId: id, target, messages, missedGoals },
										index,
									) => {
										const tempStats = {
											Health: 0,
											Protection: 0,
											Speed: 0,
											"Critical Damage %": 0,
											"Potency %": 0,
											"Tenacity %": 0,
											"Physical Damage": 0,
											"Special Damage": 0,
											Armor: 0,
											Resistance: 0,
											"Accuracy %": 0,
											"Critical Avoidance %": 0,
											"Physical Critical Chance %": 0,
											"Special Critical Chance %": 0,
										};
										const character =
											profilesManagement$.activeProfile.characterById[
												id
											].peek() ||
											Character.createCharacter(
												id,
												{
													level: 0,
													stars: 0,
													gearLevel: 0,
													gearPieces: [],
													galacticPower: 0,
													baseStats: tempStats,
													equippedStats: tempStats,
													relicTier: 0,
												},
												[],
											);

										return index % 2 === 0 ? (
											<div key={`${id}-Avatar`} className="grid gap-1 p-4">
												<CharacterAvatar character={character} />
												<br />
												{baseCharacterById[id]
													? baseCharacterById[id].name
													: id}
											</div>
										) : (
											<div key={`${id}-Messages`} className="grid gap-1 p-4">
												<h4>{target.id}:</h4>
												<ul>
													{messages?.map((message) => (
														<li key={message}>{message}</li>
													))}
												</ul>
												<ul className={"text-red-600"}>
													{missedGoals.map(([missedGoal, value]) => (
														<li key={missedGoal.id}>
															{`Missed goal stat for ${
																missedGoal.stat
															}. Value of ${
																value % 1 ? value.toFixed(2) : value
															} was not between ${
																missedGoal.minimum
															} and ${missedGoal.maximum}.`}
														</li>
													))}
												</ul>
											</div>
										);
									},
								)}
							</div>
						</div>
					</div>
				</div>
				<div className={"flex justify-center"}>
					<DialogClose asChild>
						<Button>Close</Button>
					</DialogClose>
				</div>
			</div>,
		);
	}
	return true;
};
*/

/**
 * Run the optimization algorithm and update the player's profile with the results
 */
export function optimizeMods(): void {
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
		dialog$.showError(
			"Missing character data required to optimize. Try fetching your data and trying again.",
		);
		return;
	}

	/*
	optimizationWorker = new Worker(
		new URL("../../workers/optimizer.ts", import.meta.url),
		{ type: "module" },
	);

	optimizationWorker.onerror = (error) => {
		console.log(error);
		optimizationWorker?.terminate();
		dialog$.hide();
		isBusy$.set(false);
		dialog$.showError(error.message);
	};

	optimizationWorker.onmessage = (message) => {
		switch (message.data.type) {
			case "OptimizationSuccess":
				isBusy$.set(false);
				progress$.optimizationStatus.assign({
					character: "",
					characterCount: 100,
					characterIndex: 100,
					message: "Rendering your results",
					progress: 0,
				});
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
				break;
			case "Progress":
				//					isBusy$.set(false);
				progress$.optimizationStatus.assign({
					character: message.data.character,
					characterCount: message.data.characterCount,
					characterIndex: message.data.characterIndex,
					message: message.data.step,
					progress: message.data.progress,
					targetStat: message.data.targetStat,
					targetStatCount: message.data.targetStatCount,
					targetStatIndex: message.data.targetStatIndex,
				});
				break;
			case "Ready":
				optimizationWorker?.postMessage(allycode);
				break;
			default:
			// Do nothing
		}
	};
*/
}
