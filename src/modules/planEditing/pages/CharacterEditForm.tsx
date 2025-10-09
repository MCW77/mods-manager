// react
import { lazy } from "react";
import {
	For,
	Memo,
	observer,
	reactive,
	Reactive,
	Show,
	use$,
	useMount,
} from "@legendapp/state/react";

// state
import { beginBatch, endBatch } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;

const { optimizeMods } = await import("#/modules/optimize/optimize");

import { dialog$ } from "#/modules/dialog/state/dialog";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { progress$ } from "#/modules/progress/state/progress";
import { target$ } from "#/modules/planEditing/state/planEditing";

// domain
import { characterSettings } from "#/constants/characterSettings";

import * as Character from "#/domain/Character";
import type { CharacterSettings } from "#/domain/CharacterSettings";
import * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { TargetStat } from "#/domain/TargetStat";

import type { FlatCharacterModding } from "#/modules/compilations/domain/CharacterModdings";

// components
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar"),
);
const OptimizerProgress = lazy(
	() => import("#/modules/progress/components/OptimizerProgress"),
);
import { SetRestrictionsWidget } from "#/modules/planEditing/components/SetRestrictionsWidget";
import { StatWeightsWidget } from "#/modules/planEditing/components/StatWeightsWidget";
const TargetStatsWidget = lazy(
	() => import("#/modules/planEditing/components/TargetStatsWidget"),
);
import { PrimaryStatRestrictionsWidget } from "#/modules/planEditing/components/PrimaryStatRestrictionsWidget";
import { Button } from "#ui/button";
import { DialogClose } from "#ui/dialog";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs-vertical";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";

const ReactiveButton = reactive(Button);
const ReactiveInput = reactive(Input);
const ReactiveSelect = reactive(Select);
enableReactComponents();

type ComponentProps = {
	character: Character.Character;
	target: OptimizationPlan.OptimizationPlan;
};

const CharacterEditForm: React.FC<ComponentProps> = observer(
	({ character, target }: ComponentProps) => {
		const allycode = use$(profilesManagement$.profiles.activeAllycode);
		const baseCharacterById = use$(characters$.baseCharacterById);
		const progress = use$(progress$.optimizationStatus);
		const modAssignments = use$(
			compilations$.defaultCompilation.flatCharacterModdings,
		);
		const targetIsInAdvancedEditMode = use$(target$.isInAdvancedEditMode);
		const targetMinimumModDots = use$(
			() => target$.target.minimumModDots.get()?.toString() ?? "5",
		);
		const currentCharacter = use$(optimizerView$.currentCharacter);
		const targetName = use$(target$.target.id);
		const targetsNames = profilesManagement$.activeProfile.characterById[
			character.id
		].targets
			.peek()
			.map((target) => target.id);
		const targets = Character.targets(characterSettings, character);
		//		const targetsNames$ = useObservable(targets.map((target) => target.id));

		const cloneOptimizationPlan = () => structuredClone(target);

		useMount(() => {
			beginBatch();
			target$.characterId.set(character.id);
			target$.target.assign(
				target$.isInAdvancedEditMode.peek()
					? OptimizationPlan.normalize(cloneOptimizationPlan())
					: cloneOptimizationPlan(),
			);
			target$.uneditedTarget.assign(cloneOptimizationPlan());
			target$.namesOfUserTargets.set(targetsNames);
			endBatch();
			const defaultTarget = characterSettings[character.id]
				? (characterSettings[character.id] as CharacterSettings).targets.find(
						(defaultTarget) => defaultTarget.id === target.id,
					)
				: null;
		});

		const missedGoalsSection = (
			modAssignments: FlatCharacterModding | null,
		) => {
			if ((target$.target.targetStats.peek() || []).length === 0) {
				return;
			}

			const resultsInner = (() => {
				if (progress$.finished.peek() === false) {
					return <OptimizerProgress />;
				}

				const rerunButton = (
					<div className={"actions"}>
						<Button type={"button"} onClick={() => runIncrementalCalc()}>
							Run Incremental Optimization
						</Button>
					</div>
				);

				if (modAssignments === null) {
					return (
						<div id={"missed-form"}>
							<div className={"form-row"}>
								<span>No optimization data yet!</span>
							</div>
							{rerunButton}
						</div>
					);
				}

				const missedGoals = modAssignments.missedGoals;

				if (missedGoals.length === 0) {
					return (
						<div id={"missed-form"}>
							<div className={"form-row"}>
								<span>No missed targets from last run</span>
							</div>
							{rerunButton}
						</div>
					);
				}

				const targetStatRows = missedGoals.map(
					([targetStat, resultValue]: [t: TargetStat, r: number]) => (
						<div className={"form-row"} key={targetStat.id}>
							<span>{targetStat.stat}</span>
							<span>
								({targetStat.minimum})-({targetStat.maximum})
							</span>
							<span>
								{(targetStat.minimum ?? 0 > resultValue) ? " ↓ " : " ↑ "}
							</span>
							<span>{resultValue}</span>
						</div>
					),
				);

				return (
					<div id={"missed-form"}>
						{targetStatRows}
						{rerunButton}
					</div>
				);
			})();

			return (
				<div className={"incremental-optimization"}>
					<div className={"title"}>Incremental Optimization</div>
					<hr />
					<div className={"content"}>{resultsInner}</div>
				</div>
			);
		};

		const runIncrementalCalc = () => {
			saveTarget();

			const onFinishedDispose = progress$.finished.onChange(({ value }) => {
				if (value) {
					onFinishedDispose();

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
															<div
																key={`${id}-Avatar`}
																className="grid gap-1 p-4"
															>
																<CharacterAvatar character={character} />
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
				}
			});

			optimizeMods();
		};

		const saveTarget = () => {
			let newTarget = structuredClone(target$.target.peek());
			if (target$.isInAdvancedEditMode.peek())
				newTarget = OptimizationPlan.denormalize(newTarget);
			const charId = target$.characterId.peek();

			compilations$.saveTarget(charId, newTarget);
		};

		return (
			<Reactive.form
				className={
					"character-edit-form w-full flex flex-col flex-gap-2 items-stretch justify-center p-8"
				}
				noValidate={targetIsInAdvancedEditMode}
				onSubmit={(e) => {
					e.preventDefault();
					saveTarget();
					incrementalOptimization$.indicesByProfile[allycode].set(null);
					optimizerView$.view.set("basic");
				}}
			>
				<div className={"flex flex-gap-4 justify-between"}>
					<div className={"flex flex-gap-2 items-center"}>
						<CharacterAvatar character={character} />
						<Label>
							{baseCharacterById[character.id]
								? baseCharacterById[character.id].name
								: character.id}
						</Label>
					</div>
					<div className={"flex gap-2 justify-center items-center"}>
						<div className={"actions p-2 flex gap-2 justify-center"}>
							<Show if={target$.isTargetChanged}>
								<Button
									type={"button"}
									onClick={() => {
										target$.target.set({ ...target$.uneditedTarget.peek() });
									}}
								>
									Reset target
								</Button>
							</Show>
							<Show if={target$.canDeleteTarget}>
								<Button
									type={"button"}
									id={"delete-button"}
									variant={"destructive"}
									onClick={() => {
										compilations$.deleteTarget(character.id, target.id);
										optimizerView$.view.set("basic");
									}}
								>
									Delete target
								</Button>
							</Show>
							<Button
								type={"button"}
								onClick={() => {
									optimizerView$.view.set("basic");
								}}
							>
								Cancel
							</Button>
							<Memo>
								<ReactiveButton
									$disabled={target$.isUnsaveable}
									type={"submit"}
								>
									Save
								</ReactiveButton>
							</Memo>
						</div>
						<Label htmlFor={"plan-name"}>Target Name: </Label>
						<div className={"flex flex-nowrap items-center"}>
							<ReactiveInput
								className={"w-fit"}
								id={"plan-name"}
								type={"text"}
								$value={target$.target.id}
								onChange={(e: React.FormEvent<HTMLInputElement>) => {
									target$.target.id.set(e.currentTarget.value);
								}}
							/>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline">Select</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56">
									<DropdownMenuLabel>Targets</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuRadioGroup
										value={targetName}
										onValueChange={(value) => {
											const foundTarget = targets.find(
												(targetItem) => targetItem.id === value,
											);

											if (foundTarget !== undefined) {
												beginBatch();
												compilations$.changeTarget(
													currentCharacter.index,
													foundTarget,
												);
												target$.target.set(foundTarget);
												target$.uneditedTarget.set(
													structuredClone(foundTarget),
												);
												endBatch();
											}
										}}
									>
										<For each={target$.namesOfAllTargets}>
											{(targetName$) => {
												const targetName = use$(targetName$);

												return (
													<DropdownMenuRadioItem value={targetName}>
														{targetName}
													</DropdownMenuRadioItem>
												);
											}}
										</For>
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
				<Tabs
					className="h-full w-full"
					defaultValue="Mods"
					orientation={"vertical"}
				>
					<TabsList>
						<TabsTrigger value="Mods">Mods</TabsTrigger>
						<TabsTrigger value="Weights">Weights</TabsTrigger>
						<TabsTrigger value="Primaries">Primaries</TabsTrigger>
						<TabsTrigger value="Sets">Sets</TabsTrigger>
						<TabsTrigger value="Stat Targets">Target Stats</TabsTrigger>
					</TabsList>
					<TabsContent value="Mods">
						<div className={"flex flex-col flex-gap-4"}>
							<div>
								<Label htmlFor="mod-dots" id={"mod-dots-label"}>
									Use only mods with at least&nbsp;
									<span>
										<ReactiveSelect
											name={"mod-dots"}
											$value={() => targetMinimumModDots}
											onValueChange={(value) => {
												if (value === "") return;
												target$.target.minimumModDots.set(
													Number.parseInt(value),
												);
											}}
										>
											<SelectTrigger
												className={"w-12 h-4 px-2 mx-2 inline-flex"}
												id={"mod-dots2"}
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												className={"w-8 min-w-12"}
												position={"popper"}
												sideOffset={5}
											>
												{[1, 2, 3, 4, 5, 6].map((dots) => (
													<SelectItem
														className={"w-8"}
														key={dots}
														value={dots.toString()}
													>
														{dots}
													</SelectItem>
												))}
											</SelectContent>
										</ReactiveSelect>
									</span>
									&nbsp;dot(s)
								</Label>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="Weights">
						<StatWeightsWidget />
					</TabsContent>
					<TabsContent value="Primaries">
						<PrimaryStatRestrictionsWidget />
					</TabsContent>
					<TabsContent value="Sets">
						<SetRestrictionsWidget />
					</TabsContent>
					<TabsContent value="Stat Targets">
						<div className={"flex flex-wrap gap-2"}>
							<TargetStatsWidget />
							{missedGoalsSection(
								modAssignments.find(
									(modAssignment) => modAssignment.characterId === character.id,
								) ?? null,
							)}
						</div>
					</TabsContent>
				</Tabs>
			</Reactive.form>
		);
	},
);

CharacterEditForm.displayName = "CharacterEditForm";

export default CharacterEditForm;
