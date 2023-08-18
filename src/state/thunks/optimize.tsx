// react
import React from "react";
import { ThunkResult } from "../reducers/modsOptimizer";

// state
import getDatabase from "../storage/Database";

//modules
import { Data } from "../modules/data";
import { actions } from "../actions/optimize";
import { Review } from "../modules/review";

// actions
import {
  hideModal,
  setIsBusy,
  showError,
  showFlash,
} from "../actions/app";

// thunks
import {
  updateProfile,
} from './app';

// domain
import { Character } from "../../domain/Character";
import { OptimizationStatus } from "../../domain/OptimizationStatus";
import OptimizerRun from "../../domain/OptimizerRun";
import { IModSuggestion } from "../../domain/PlayerProfile";

// components
import { CharacterAvatar } from "../../components/CharacterAvatar/CharacterAvatar";

let optimizationWorker: Worker | null = null;

export namespace thunks {
	export function cancelOptimizer(): ThunkResult<void> {
		return function (dispatch) {
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
		result: IModSuggestion[],
		settings: OptimizerRun,
	): ThunkResult<void> {
		return updateProfile(
			(profile) => profile.withModAssignments(result),
			(dispatch, getState, newProfile) => {
				const db = getDatabase();
				db.saveLastRun(settings, (error) =>
					dispatch(
						showFlash(
							"Storage Error",
							`Error saving your last run to the database: ${error?.message} The optimizer may not recalculate correctly on your next optimization`,
						),
					),
				);

				dispatch(setIsBusy(false));
				dispatch(actions.updateProgress({} as OptimizationStatus));

				// If this was an incremental optimization, leave the user on their current page
				if (newProfile.incrementalOptimizeIndex !== null) {
					return;
				}

				dispatch(
					Review.thunks.updateModListFilter({
						view: "sets",
						sort: "assignedCharacter",
					}),
				);
				dispatch(Review.actions.changeOptimizerView("review"));
				dispatch(hideModal());

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

					dispatch(
						showFlash(
							"",
							<div className={"optimizer-messages"}>
								<h3>Important messages regarding your selected targets</h3>
								<table>
									<thead>
										<tr>
											<th>Character</th>
											<th>Messages</th>
										</tr>
									</thead>
									<tbody>
										{resultsWithMessages.map(
											({ id, target, messages, missedGoals }, index) => {
												const character =
													newProfile.characters[id] || new Character(id);
												return (
													<tr key={index}>
														<td>
															<CharacterAvatar character={character} />
															<br />
															{baseCharacters[id]
																? baseCharacters[id].name
																: id}
														</td>
														<td>
															<h4>{target.name}:</h4>
															<ul>
																{messages!.map((message, index) => (
																	<li key={index}>{message}</li>
																))}
															</ul>
															<ul className={"missed-goals"}>
																{missedGoals.map(
																	([missedGoal, value], index) => (
																		<li key={index}>
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
														</td>
													</tr>
												);
											},
										)}
									</tbody>
								</table>
							</div>,
						),
					);
				}
			},
		);
	}

	/**
	 * Run the optimization algorithm and update the player's profile with the results
	 */
	export function optimizeMods(): ThunkResult<void> {
		return function (dispatch, getState) {
			const profile = getState().profile;

			// If any of the characters being optimized don't have stats, then show an error message
			if (
				Object.values(profile.characters).filter(
					(char) =>
						null === char.playerValues.baseStats ||
						null === char.playerValues.equippedStats,
				).length > 0
			) {
				dispatch(
					showError(
						"Missing character data required to optimize. Try fetching your data and trying again.",
					),
				);
				return;
			}

			dispatch(actions.startModOptimization());
			optimizationWorker = new Worker(
				`/workers/optimizer.js?version=${
					import.meta.env.VITE_VERSION || "local"
				}`,
			);

			optimizationWorker.onmessage = function (message) {
				switch (message.data.type) {
					case "OptimizationSuccess":
						dispatch(setIsBusy(false));
						dispatch(
							actions.updateProgress({
								character: null,
								step: "Rendering your results",
								progress: 100,
							}),
						);
						// Set a timeout so the modal has time to display
						setTimeout(
							() =>
								dispatch(
									finishModOptimization(
										message.data.result,
										profile.toOptimizerRun(),
									),
								),
							0,
						);
						break;
					case "Progress":
						dispatch(setIsBusy(false));
						dispatch(actions.updateProgress(message.data));
						break;
					default:
					// Do nothing
				}
			};

			optimizationWorker.onerror = function (error) {
				console.log(error);
				optimizationWorker?.terminate();
				dispatch(hideModal());
				dispatch(setIsBusy(false));
				dispatch(showError(error.message));
			};

			optimizationWorker.postMessage(profile.allyCode);
		};
	}
}
