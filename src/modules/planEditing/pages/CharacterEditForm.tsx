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

const characters$ = stateLoader$.characters$;
const compilations$ = stateLoader$.compilations$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;
const roster$ = stateLoader$.roster$;

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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "#ui/tabs";

import { Input } from "#/components/reactive/Input";
import { Select as ReactiveSelect } from "#/components/reactive/Select";

import { Button } from "#ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Label } from "#ui/label";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

import OptimizerProgress from "#/modules/progress/components/OptimizerProgress";
import { SetRestrictionsWidget } from "#/modules/planEditing/components/SetRestrictionsWidget";
import { StatWeightsWidget } from "#/modules/planEditing/components/StatWeightsWidget";
import TargetStatsWidget from "#/modules/planEditing/components/TargetStatsWidget";
import { PrimaryStatRestrictionsWidget } from "#/modules/planEditing/components/PrimaryStatRestrictionsWidget";
import { MissedGoals as MissedGoalsMessages } from "#/modules/progress/components/MissedGoals";

const ReactiveButton = reactive(Button);
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
				dialog$.showError({
					error: "Optimization aborted!",
					reason: "Character data is missing",
					solution:
						"Please refetch to add the missing characters and try again!",
				});
				return;
			}

			const error = progress$.error.peek();
			if (error !== null) {
				const stack = `${error.stack?.replaceAll("\tat ", "\r\nat ") ?? ""}`;
				dialog$.showError({
					error: "Optimization aborted!",
					reason: (
						<div>
							<p>{error.message}</p>
							<pre className={"text-wrap"}>{stack}</pre>
						</div>
					),
					solution: "Please report on discord if stuck with this error!",
					contentStyle: "sm:max-w-[70vw]",
				});

				return;
			}

			const messages = progress$.postOptimizationMessages.peek();
			if (messages.length > 0) {
				dialog$.show({
					content: (
						<MissedGoalsMessages
							baseCharacterById={baseCharacterById}
							flatCharacterModdings={messages}
						/>
					),
				});
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
		const baseCharacterById = useValue(characters$.baseCharacterById);
		const modAssignments = useValue(
			compilations$.defaultCompilation.flatCharacterModdings,
		);
		const targetIsInAdvancedEditMode = useValue(target$.isInAdvancedEditMode);
		const currentCharacter = useValue(optimizerView$.currentCharacter);
		const targetName = useValue(target$.target.id);
		const targetsNames = roster$.activeCharacterById[character.id].targets
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

		async function SubmitFormAction() {
			saveTarget();
			incrementalOptimization$.activeIndex.set(null);
			optimizerView$.view.set("basic");
		}

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
				action={SubmitFormAction}
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
										compilations$.deleteTarget(
											character.id,
											target$.target.id.peek(),
										);
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
							<Input
								className={"w-fit"}
								id={"plan-name"}
								type={"text"}
								$value={target$.target.id}
							/>
							<DropdownMenu>
								<DropdownMenuTrigger
									render={<Button variant="outline">Select</Button>}
								/>
								<DropdownMenuContent className="w-56">
									<DropdownMenuGroup>
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
														<DropdownMenuRadioItem
															closeOnClick
															value={targetName}
														>
															{targetName}
														</DropdownMenuRadioItem>
													);
												}}
											</For>
										</DropdownMenuRadioGroup>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</div>
				<Tabs
					className="h-full w-full rounded-md p-1 border-3 border-white text-muted-foreground gap-1"
					defaultValue="Mods"
					orientation={"vertical"}
				>
					<TabsList className={"h-auto! justify-start"}>
						<TabsTrigger className={"grow-0"} value="Mods">
							Mods
						</TabsTrigger>
						<TabsTrigger className={"grow-0"} value="Weights">
							Weights
						</TabsTrigger>
						<TabsTrigger className={"grow-0"} value="Primaries">
							Primaries
						</TabsTrigger>
						<TabsTrigger className={"grow-0"} value="Sets">
							Sets
						</TabsTrigger>
						<TabsTrigger className={"grow-0"} value="Stat Targets">
							Target Stats
						</TabsTrigger>
					</TabsList>
					<TabsContent value="Mods">
						<div className={"flex flex-col flex-gap-4"}>
							<div>
								<Label htmlFor="mod-dots" id={"mod-dots-label"}>
									Use only mods with at least&nbsp;
									<span>
										<ReactiveSelect
											name={"mod-dots"}
											$value={target$.target.minimumModDots}
										>
											<SelectTrigger
												className={"w-12 h-4 px-2 mx-2 inline-flex"}
												id={"mod-dots2"}
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent
												className={"w-8 min-w-12"}
												alignItemWithTrigger={false}
												sideOffset={5}
											>
												<SelectItem value={5}>{5}</SelectItem>
												<SelectItem value={6}>{6}</SelectItem>
											</SelectContent>
										</ReactiveSelect>
									</span>
									&nbsp;dot(s)
								</Label>
							</div>
						</div>
					</TabsContent>
					<TabsContent className={"flex-initial"} value="Weights">
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
