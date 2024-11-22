// react
import type React from "react";
import {
	Memo,
	observer,
	reactive,
	Reactive,
	Show,
	useMount,
} from "@legendapp/state/react";

// state
import { beginBatch, endBatch } from "@legendapp/state";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
const { compilations$ } = await import(
	"#/modules/compilations/state/compilations"
);
const { characters$ } = await import("#/modules/characters/state/characters");
const { incrementalOptimization$ } = await import(
	"#/modules/incrementalOptimization/state/incrementalOptimization"
);

import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { progress$ } from "#/modules/progress/state/progress";
import { target$ } from "#/modules/planEditing/state/planEditing";

// modules
import { Optimize } from "#/state/modules/optimize";

// domain
import { characterSettings } from "#/constants/characterSettings";

import type * as Character from "#/domain/Character";
import type { CharacterSettings } from "#/domain/CharacterSettings";
import * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { TargetStat } from "#/domain/TargetStat";

import type { FlatCharacterModding } from "#/modules/compilations/domain/CharacterModdings";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { OptimizerProgress } from "#/modules/progress/components/OptimizerProgress";
import { SetRestrictionsWidget } from "#/modules/planEditing/components/SetRestrictionsWidget";
import { StatWeightsWidget } from "#/modules/planEditing/components/StatWeightsWidget";
import { TargetStatsWidget } from "#/modules/planEditing/components/TargetStatsWidget";
import { PrimaryStatRestrictionsWidget } from "#/modules/planEditing/components/PrimaryStatRestrictionsWidget";
import { Button } from "#ui/button";
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
		const allycode = profilesManagement$.profiles.activeAllycode.get();
		const baseCharacterById = characters$.baseCharacterById.get();
		const progress = progress$.optimizationStatus.get();
		const modAssignments =
			compilations$.defaultCompilation.flatCharacterModdings.get();

		const targetsNames = profilesManagement$.activeProfile.characterById[
			character.id
		].targets
			.peek()
			.map((target) => target.id);

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
				if (progress.message !== "") {
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
					(
						[targetStat, resultValue]: [t: TargetStat, r: number],
						index: number,
					) => (
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

				<div id={"missed-form"}>
					{targetStatRows}
					{rerunButton}
				</div>;
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
			isBusy$.set(true);
			Optimize.thunks.optimizeMods();
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
				noValidate={target$.isInAdvancedEditMode.get()}
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
							<Show if={target$.isTargetChanged.get()}>
								{() => (
									<Button
										type={"button"}
										onClick={() => {
											target$.target.set({ ...target$.uneditedTarget.peek() });
										}}
									>
										Reset target
									</Button>
								)}
							</Show>
							<Show if={target$.canDeleteTarget.get()}>
								{() => (
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
								)}
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
								{() => (
									<ReactiveButton
										$disabled={target$.isUnsaveable.get()}
										type={"submit"}
									>
										Save
									</ReactiveButton>
								)}
							</Memo>
						</div>
						<Label htmlFor={"plan-name"}>Target Name: </Label>
						<ReactiveInput
							className={"w-fit"}
							id={"plan-name"}
							type={"text"}
							$value={target$.target.id}
							onChange={(e: React.FormEvent<HTMLInputElement>) => {
								target$.target.id.set(e.currentTarget.value);
							}}
						/>
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
											$value={() =>
												target$.target.minimumModDots.get()?.toString() ?? "5"
											}
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

export { CharacterEditForm };
