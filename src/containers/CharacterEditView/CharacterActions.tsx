// react
import { lazy, useId } from "react";
import {
	Computed,
	observer,
	use$,
	useObservable,
} from "@legendapp/state/react";

// state
import { beginBatch, endBatch } from "@legendapp/state";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;
const lockedStatus$ = stateLoader$.lockedStatus$;

const { optimizeMods } = await import("#/modules/optimize/optimize");

import { dialog$ } from "#/modules/dialog/state/dialog";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { review$ } from "#/modules/review/state/review";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import { createCharacter } from "#/domain/Character";

// component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowsRotate,
	faGears,
	faLock,
	faSave,
	faUnlock,
} from "@fortawesome/free-solid-svg-icons";

const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar"),
);
const OptimizerProgress = lazy(
	() => import("#/modules/progress/components/OptimizerProgress"),
);

import { HelpLink } from "#/modules/help/components/HelpLink";
import { SettingsLink } from "#/modules/settings/components/SettingsLink";

import { Button } from "#ui/button";
import { DialogClose } from "#ui/dialog";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover";
import { progress$ } from "#/modules/progress/state/progress";

const CharacterActions: React.FC = observer(() => {
	const nameId = useId();
	const descriptionId = useId();
	const categoryId = useId();

	const baseCharacterById = use$(characters$.baseCharacterById);
	const selectedCharacters = use$(
		compilations$.defaultCompilation.selectedCharacters,
	);
	const modAssignments = use$(
		compilations$.defaultCompilation.flatCharacterModdings,
	);

	const state$ = useObservable({
		isFormOpen: false,
		name: compilations$.activeCompilation.id.get(),
		description: compilations$.activeCompilation.description.get(),
		category: compilations$.activeCompilation.category.get(),
	});

	const isFormOpen = use$(state$.isFormOpen);
	const compilationName = use$(state$.name);
	const compilationDescription = use$(state$.description);
	const compilationCategory = use$(state$.category);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		beginBatch();
		if (
			!compilations$.compilationByIdForActiveAllycode
				.peek()
				.has(state$.name.peek())
		) {
			compilations$.addCompilation(
				state$.name.peek(),
				state$.description.peek(),
				state$.category.peek(),
			);
		}
		compilations$.compilationByIdForActiveAllycode[state$.name.peek()].set(
			structuredClone(compilations$.defaultCompilation.peek()),
		);
		compilations$.compilationByIdForActiveAllycode[state$.name.peek()].id.set(
			state$.name.peek(),
		);
		compilations$.compilationByIdForActiveAllycode[
			state$.name.peek()
		].description.set(state$.description.peek());
		compilations$.compilationByIdForActiveAllycode[
			state$.name.peek()
		].category.set(state$.category.peek());
		compilations$.activeCompilationId.set(state$.name.peek());
		state$.isFormOpen.set(false);
		endBatch();
	};

	return (
		<div className={"flex gap-2"}>
			<Button
				type="button"
				onClick={() => {
					incrementalOptimization$.indicesByProfile[
						profilesManagement$.profiles.activeAllycode.get()
					].set(null);

					type IndexOfCharacters = { [id in CharacterNames]: number };
					const minCharacterIndices: IndexOfCharacters =
						selectedCharacters.reduce(
							(indices, { id }, charIndex) => {
								indices[id] = charIndex;
								return indices;
							},
							{ [selectedCharacters[0].id]: 0 },
						) as IndexOfCharacters;

					const invalidTargets = selectedCharacters
						.filter(({ target }, index) =>
							target.targetStats.find(
								(targetStat) =>
									targetStat.relativeCharacterId !== "null" &&
									minCharacterIndices[targetStat.relativeCharacterId] > index,
							),
						)
						.map(({ id }) => id);

					if (invalidTargets.length > 0) {
						dialog$.showError(
							"Didn't optimize your selected charcters!",
							<div>
								<p>You have invalid targets set!</p>,
								<p>
									For relative targets, the character compared to MUST be
									earlier in the selected characters list. The following
									characters don't follow this rule:
								</p>
								,
								<ul>
									{invalidTargets.map((id) => (
										<li key={id}>{baseCharacterById[id]?.name ?? id}</li>
									))}
								</ul>
							</div>,
							"Just move the characters to the correct order and try again!",
						);
					} else {
						const onFinishedDispose = progress$.finished.onChange(
							({ value }) => {
								if (value) {
									onFinishedDispose();
									dialog$.hide();
									if (progress$.hasMissingCharacters.peek() === true) {
										dialog$.showError(
											"Optimization aborted!",
											"Character data is missing",
											"Please refetch to add the missing characters and try again!",
										);
										return;
									}

									const error = progress$.error.peek();
									if (error !== null) {
										dialog$.showError(
											"Optimization aborted!",
											error.message,
											"Please try again!",
										);
										return;
									}

									const messages = progress$.postOptimizationMessages.peek();
									if (messages.length > 0) {
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
																{messages.map(
																	(
																		{
																			characterId: id,
																			target,
																			messages,
																			missedGoals,
																		},
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
																			createCharacter(
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
																			<div
																				key={`${id}-Avatar`}
																				className="grid gap-1 p-4"
																			>
																				<CharacterAvatar
																					character={character}
																				/>
																				<br />
																				{baseCharacterById[id]
																					? baseCharacterById[id].name
																					: id}
																			</div>
																		) : (
																			<div
																				key={`${id}-Messages`}
																				className="grid gap-1 p-4"
																			>
																				<h4>{target.id}:</h4>
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
																									value % 1
																										? value.toFixed(2)
																										: value
																								} was not between ${
																									missedGoal.minimum
																								} and ${missedGoal.maximum}.`}
																							</li>
																						),
																					)}
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
								}
							},
						);

						dialog$.show(<OptimizerProgress />, true);
						optimizeMods();
					}
				}}
				disabled={selectedCharacters.length === 0}
			>
				<span className="fa-layers">
					<FontAwesomeIcon
						icon={faArrowsRotate}
						title="Optimize"
						transform="grow-8"
					/>
					<FontAwesomeIcon icon={faGears} size="xs" transform="shrink-6" />
				</span>
			</Button>
			<Popover open={isFormOpen} onOpenChange={state$.isFormOpen.set}>
				<PopoverTrigger className={"m-auto p-2"} asChild>
					<Button size="sm">
						<FontAwesomeIcon icon={faSave} title={"Save"} />
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-80"
					onPointerDownOutside={(e) => e.preventDefault()}
				>
					<form onSubmit={handleSubmit} className="flex flex-col space-y-2">
						<h4 className="font-medium text-sm text-primary-foreground">
							Save compilation
						</h4>
						<Label htmlFor={`compilation_save_form_name-${nameId}`}>Name</Label>
						<Computed>
							<Input
								id={`compilation_save_form_name-${nameId}`}
								value={compilationName}
								onChange={(e) => state$.name.set(e.target.value)}
								className="h-8 text-sm"
							/>
						</Computed>
						<Label
							htmlFor={`compilation_save_form_description-${descriptionId}`}
						>
							Description
						</Label>
						<Computed>
							<Input
								id={`compilation_save_form_description-${descriptionId}`}
								value={compilationDescription}
								onChange={(e) => state$.description.set(e.target.value)}
								className="h-8 text-sm"
							/>
						</Computed>
						<Label htmlFor={`compilation_save_form_category-${categoryId}`}>
							Category
						</Label>
						<Computed>
							<Input
								id={`compilation_save_form_category-${categoryId}`}
								value={compilationCategory}
								onChange={(e) => state$.category.set(e.target.value)}
								className="h-8 text-sm"
							/>
						</Computed>
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => state$.isFormOpen.set(false)}
							>
								Cancel
							</Button>
							<Button type="submit" size="sm">
								Save
							</Button>
						</div>
					</form>
				</PopoverContent>
			</Popover>
			{modAssignments.length > 0 ? (
				<Button
					type={"button"}
					onClick={() => {
						review$.modListFilter.view.set("sets");
						review$.modListFilter.sort.set("assignedCharacter");
						optimizerView$.view.set("review");
					}}
				>
					Review recommendations
				</Button>
			) : null}
			<Button
				type="button"
				size="icon"
				onClick={() => {
					lockedStatus$.lockAll();
				}}
			>
				<FontAwesomeIcon icon={faLock} title="Lock All" />
			</Button>
			<Button
				type="button"
				size="icon"
				onClick={() => {
					lockedStatus$.unlockAll();
				}}
			>
				<FontAwesomeIcon icon={faUnlock} title="Unlock All" />
			</Button>
			<HelpLink
				title="Global Settings Helppage"
				section="optimizer"
				topic={1}
			/>
			<SettingsLink title="Global Settings" section="optimizer" />
		</div>
	);
});

CharacterActions.displayName = "CharacterActions";

export default CharacterActions;
