// react
import {
	For,
	Memo,
	observer,
	reactive,
	Show,
	useValue,
	useMount,
	useObservable,
} from "@legendapp/state/react";

// state
import { beginBatch, endBatch, type Observable } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;

import { optimizeMods } from "#/modules/optimize/optimize";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { progress$ } from "#/modules/progress/state/progress";
import { target$ } from "#/modules/planEditing/state/planEditing";

// domain
import { characterSettings } from "#/constants/characterSettings";

import * as Character from "#/domain/Character";
import * as OptimizationPlan from "#/domain/OptimizationPlan";

import type { BaseCharacter } from "#/modules/characters/domain/BaseCharacter";
import type { FlatCharacterModding } from "#/modules/compilations/domain/CharacterModdings";
import type {
	MissedGoal,
	MissedGoals,
} from "#/modules/compilations/domain/MissedGoals";

// components
import CharacterAvatar from "#/components/CharacterAvatar/CharacterAvatar";
import OptimizerProgress from "#/modules/progress/components/OptimizerProgress";
import { SetRestrictionsWidget } from "#/modules/planEditing/components/SetRestrictionsWidget";
import { StatWeightsWidget } from "#/modules/planEditing/components/StatWeightsWidget";
import TargetStatsWidget from "#/modules/planEditing/components/TargetStatsWidget";
import { PrimaryStatRestrictionsWidget } from "#/modules/planEditing/components/PrimaryStatRestrictionsWidget";
import { Button } from "#ui/button";
import { DialogClose } from "#/components/custom/dialog";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "#/components/custom/tabs-vertical";
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

const runIncrementalCalc = (
	saveTarget: () => void,
	baseCharacterById: Record<string, BaseCharacter>,
) => {
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
														0,
														[],
														[],
													);

												return index % 2 === 0 ? (
													<div key={`${id}-Avatar`} className="grid gap-1 p-4">
														<CharacterAvatar
															character={character}
															displayBadges={false}
															displayStars={false}
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

type IncrementalOptimizationSectionProps = {
	modAssignments: FlatCharacterModding;
	saveTarget: () => void;
	baseCharacterById: Record<string, BaseCharacter>;
};

type RerunButtonProps = {
	saveTarget: () => void;
	baseCharacterById: Record<string, BaseCharacter>;
};

function RerunButton({ saveTarget, baseCharacterById }: RerunButtonProps) {
	return (
		<Button
			type={"button"}
			onClick={() => runIncrementalCalc(saveTarget, baseCharacterById)}
		>
			Run Incremental Optimization
		</Button>
	);
}

type MissedGoalsSectionProps = {
	missedGoals$: Observable<MissedGoals>;
	saveTarget: () => void;
	baseCharacterById: Record<string, BaseCharacter>;
};

function MissedGoalItem({
	missedGoal$,
}: {
	missedGoal$: Observable<MissedGoal>;
}) {
	const targetStat = useValue(missedGoal$[0]);
	const resultValue = useValue(missedGoal$[1]);
	return (
		<div>
			<span>{targetStat.stat}</span>
			<span>
				({targetStat.minimum})-({targetStat.maximum})
			</span>
			<span>{(targetStat.minimum ?? 0 > resultValue) ? " ↓ " : " ↑ "}</span>
			<span>{resultValue}</span>
		</div>
	);
}

function MissedGoalsSection({
	missedGoals$,
	saveTarget,
	baseCharacterById,
}: MissedGoalsSectionProps) {
	return (
		<Show
			if={missedGoals$.length > 0}
			else={
				<div>
					<For each={missedGoals$}>
						{(missedGoal: Observable<MissedGoal>) => (
							<MissedGoalItem missedGoal$={missedGoal} />
						)}
					</For>
					<RerunButton
						saveTarget={saveTarget}
						baseCharacterById={baseCharacterById}
					/>
				</div>
			}
		>
			<div>
				<div>
					<span>No missed targets from last run</span>
				</div>
				<RerunButton
					saveTarget={saveTarget}
					baseCharacterById={baseCharacterById}
				/>
			</div>
		</Show>
	);
}

function IncrementalOptimizationResults({
	modAssignments,
	saveTarget,
	baseCharacterById,
}: IncrementalOptimizationSectionProps) {
	const modAssignments$ = useObservable(modAssignments);
	const hasModAssignments$ = useObservable(
		() => modAssignments$.get() !== null,
	);
	return (
		<Show if={progress$.finished} else={<OptimizerProgress />}>
			<Show
				if={hasModAssignments$}
				else={() => (
					<div>
						<div>
							<span>No optimization data yet!</span>
						</div>
						<RerunButton
							saveTarget={saveTarget}
							baseCharacterById={baseCharacterById}
						/>
					</div>
				)}
			>
				{() => {
					return (
						<MissedGoalsSection
							missedGoals$={modAssignments$.missedGoals}
							saveTarget={saveTarget}
							baseCharacterById={baseCharacterById}
						/>
					);
				}}
			</Show>
		</Show>
	);
}

function IncrementalOptimizationSection({
	modAssignments,
	saveTarget,
	baseCharacterById,
}: IncrementalOptimizationSectionProps) {
	if ((target$.target.targetStats.peek() || []).length === 0) {
		return <div />;
	}

	return (
		<div>
			<div>Incremental Optimization</div>
			<hr />
			<div>
				<IncrementalOptimizationResults
					modAssignments={modAssignments}
					saveTarget={saveTarget}
					baseCharacterById={baseCharacterById}
				/>
			</div>
		</div>
	);
}

type ComponentProps = {
	character: Character.Character;
	target: OptimizationPlan.OptimizationPlan;
};

const CharacterEditForm: React.FC<ComponentProps> = observer(
	({ character, target }: ComponentProps) => {
		const allycode = useValue(profilesManagement$.profiles.activeAllycode);
		const baseCharacterById = useValue(characters$.baseCharacterById);
		const modAssignments = useValue(
			compilations$.defaultCompilation.flatCharacterModdings,
		);
		const targetIsInAdvancedEditMode = useValue(target$.isInAdvancedEditMode);
		const targetMinimumModDots = useValue(
			() => target$.target.minimumModDots.get()?.toString() ?? "5",
		);
		const currentCharacter = useValue(optimizerView$.currentCharacter);
		const targetName = useValue(target$.target.id);
		const targetsNames = profilesManagement$.activeProfile.characterById[
			character.id
		].targets
			.peek()
			.map((target) => target.id);
		const targets = Character.targets(characterSettings, character);

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
		});

		const saveTarget = () => {
			let newTarget = structuredClone(target$.target.peek());
			if (target$.isInAdvancedEditMode.peek())
				newTarget = OptimizationPlan.denormalize(newTarget);
			const charId = target$.characterId.peek();

			compilations$.saveTarget(charId, newTarget);
		};

		return (
			<form
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
						<CharacterAvatar
							character={character}
							displayBadges={false}
							displayStars={false}
						/>
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
												const targetName = useValue(targetName$);

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
													Number.parseInt(value, 10),
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
							<IncrementalOptimizationSection
								modAssignments={
									modAssignments.find(
										(modAssignment) =>
											modAssignment.characterId === character.id,
									) ?? {
										assignedMods: [],
										characterId: character.id,
										missedGoals: [],
										target,
										previousScore: 0,
										currentScore: 0,
									}
								}
								saveTarget={saveTarget}
								baseCharacterById={baseCharacterById}
							/>
						</div>
					</TabsContent>
				</Tabs>
			</form>
		);
	},
);

CharacterEditForm.displayName = "CharacterEditForm";

export default CharacterEditForm;
