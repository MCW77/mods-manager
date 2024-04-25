// react
import type { ThunkResult } from "#/state/reducers/modsOptimizer";

// state
import getDatabase from "#/state/storage/Database";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";

// actions
import { actions } from "#/state/actions/optimize";

// modules
import { App } from "#/state/modules/app";
import { Data } from "#/state/modules/data";
import { Review } from "#/state/modules/review";

// domain
import * as Character from "#/domain/Character";
import type { OptimizationStatus } from "#/domain/OptimizationStatus";
import type { OptimizerRun } from "#/domain/OptimizerRun";
import * as OptimizerSettings from "#/domain/OptimizerSettings";
import type { ModSuggestion } from "#/domain/PlayerProfile";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { Button } from "#/components/ui/button";
import { DialogClose } from "#/components/ui/dialog";

let optimizationWorker: Worker | null = null;

export namespace thunks {
	export function cancelOptimizer(): ThunkResult<void> {
		return (dispatch) => {
			optimizationWorker?.terminate();
			dispatch(actions.updateProgress({} as OptimizationStatus));
		};
	}

	/**
	 * Take the results of the mod optimization and apply them to the current profile
	 * @param result {Object} The result from the optimizer
	 * @param settings {OptimizerRun} The previous settings that were used to get this result
	 * @returns {*}
	 */
	export function finishModOptimization(
		result: ModSuggestion[],
		settings: OptimizerRun,
	): ThunkResult<void> {
		isBusy$.set(true);
		return App.thunks.updateProfile(
			(profile) => profile.withModAssignments(result),
			(dispatch, getState, newProfile) => {
				const db = getDatabase();
				db.saveLastRun(settings, (error) =>
					dialog$.showFlash(
						"Storage Error",
						`Error saving your last run to the database: ${error?.message} The optimizer may not recalculate correctly on your next optimization`,
						"",
						undefined,
						"error",
					),

				);

				isBusy$.set(false);
				dispatch(actions.updateProgress({} as OptimizationStatus));

				// If this was an incremental optimization, leave the user on their current page
				if (incrementalOptimization$.indicesByProfile[newProfile.allyCode].peek() !== null) {
					return true;
				}

				dispatch(
					Review.thunks.updateModListFilter({
						view: "sets",
						sort: "assignedCharacter",
					}),
				);
				dialog$.hide()
				optimizerView$.view.set("review");

				// Create the content of the pop-up for any post-optimization messages

				const resultsWithMessages = result
					.filter((x) => null !== x)
					.filter(
						({ messages, missedGoals }) =>
							0 < (messages?.length ?? 0) || 0 < missedGoals.length,
					);

				if (resultsWithMessages.length) {
					const state = getState();
					const baseCharacters = Data.selectors.selectBaseCharacters(state);
					const doubledResultsWithMessages = [];
					for (const item of resultsWithMessages) {
						doubledResultsWithMessages.push(item);
						doubledResultsWithMessages.push(item);
					}

					dialog$.show(
						<div className={"flex flex-col flex-gap-2"}>
							<h3 className={"text-center"}>Important messages regarding your selected targets</h3>
							<div className="flex items-center justify-center h-[75vh] px-4 md:px-6">
      					<div className="w-full max-w-4xl border rounded-lg">
									<div className="grid w-full grid-cols-[1fr_1fr] border-b">
										<div className="grid gap-1 p-4">
											<div className="text-sm font-medium tracking-wide">Character</div>
										</div>
										<div className="grid gap-1 p-4">
											<div className="text-sm font-medium tracking-wide">Messages</div>
										</div>
									</div>
									<div className="h-[70vh] overflow-auto">
					          <div className="grid w-full grid-cols-[1fr_1fr]">
											{
											  doubledResultsWithMessages.map(
													({ id, target, messages, missedGoals }, index) => {
														const tempStats = {
															Health: 0,
															Protection: 0,
															Speed: 0,
															'Critical Damage %': 0,
															'Potency %': 0,
															'Tenacity %': 0,
															'Physical Damage': 0,
															'Special Damage': 0,
															Armor: 0,
															Resistance: 0,
															'Accuracy %': 0,
															'Critical Avoidance %': 0,
															'Physical Critical Chance %': 0,
															'Special Critical Chance %': 0,
														}
														const character =
															newProfile.characters[id] || Character.createCharacter(
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
																OptimizerSettings.defaultSettings,
															);

														return (
															index % 2 === 0 ?
																<div key={`${id}-Avatar`} className="grid gap-1 p-4">
																	<CharacterAvatar character={character} />
																	<br />
																	{baseCharacters[id]
																		? baseCharacters[id].name
																		: id}
															  </div>
															:
																<div key={`${id}-Messages`} className="grid gap-1 p-4">
																	<h4>{target.name}:</h4>
																	<ul>
																		{messages?.map((message) => (
																			<li key={message}>{message}</li>
																		))}
																	</ul>
																	<ul className={"text-red-600"}>
																		{missedGoals.map(
																			([missedGoal, value]) => (
																				<li key={missedGoal.id}>
																					{`Missed goal stat for ${
																						missedGoal.stat
																					}. Value of ${
																						value % 1 ? value.toFixed(2) : value
																					} was not between ${
																						missedGoal.minimum
																					} and ${missedGoal.maximum}.`}
																				</li>
																			),
																		)}
																	</ul>
																</div>
														)
													}
												)
											}
										</div>
									</div>
								</div>
    					</div>
							<div className={"flex justify-center"}>
								<DialogClose asChild>
									<Button>
										Close
									</Button>
								</DialogClose>
							</div>
						</div>
					);
				}
				return true;
			},
		);
	}

	/**
	 * Run the optimization algorithm and update the player's profile with the results
	 */
	export function optimizeMods(): ThunkResult<void> {
		return (dispatch, getState) => {
			const profile = getState().profile;

			// If any of the characters being optimized don't have stats, then show an error message
			if (
				Object.values(profile.characters).filter(
					(char) =>
						null === char.playerValues.baseStats ||
						null === char.playerValues.equippedStats,
				).length > 0
			) {
				dialog$.showError("Missing character data required to optimize. Try fetching your data and trying again.");
				return;
			}

//			dispatch(actions.startModOptimization());
			optimizationWorker = new Worker(new URL(
				"/workers/optimizer.ts", import.meta.url),
				{ type: "module" },
			);

			optimizationWorker.onmessage = (message) => {
				switch (message.data.type) {
					case "OptimizationSuccess":
						isBusy$.set(false);
						dispatch(
							actions.updateProgress({
								character: null,
								step: "Rendering your results",
								progress: 100,
							}),
						);
						dispatch(
							finishModOptimization(
								message.data.result,
								profile.toOptimizerRun(),
							),
						);
						break;
					case "Progress":
						isBusy$.set(false);
						dispatch(actions.updateProgress(message.data));
						break;
					default:
					// Do nothing
				}
			};

			optimizationWorker.onerror = (error) => {
				console.log(error);
				optimizationWorker?.terminate();
				dialog$.hide();
				isBusy$.set(false);
				dialog$.showError(error.message);
			};

			optimizationWorker.postMessage(profile.allyCode);
		};
	}
}
