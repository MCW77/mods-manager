// react
import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";
import {
	observer,
	reactive,
	Show,
	useMount,
	useObservable,
} from "@legendapp/state/react";

// utils
import areObjectsEquivalent from "#/utils/areObjectsEquivalent";

// state
import type { ObservableObject } from "@legendapp/state";
import { Reactive } from "@legendapp/state/react";
import { enableReactComponents } from "@legendapp/state/config/enableReactComponents";

import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";
import { target$ } from "#/modules/planEditing/state/planEditing";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";
import { Data } from "#/state/modules/data";
import { Optimize } from "#/state/modules/optimize";
import { Storage } from "#/state/modules/storage";

// domain
import { characterSettings } from "#/constants/characterSettings";

import type * as Character from "#/domain/Character";
import type { CharacterSettings } from "#/domain/CharacterSettings";
import * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { ModSuggestion } from "#/domain/PlayerProfile";
import type { TargetStat } from "#/domain/TargetStat";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { OptimizerProgress } from "#/components/OptimizerProgress/OptimizerProgress";
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

const CharacterEditForm: React.FC<ComponentProps> = observer(({ character, target }: ComponentProps) => {
	const dispatch: ThunkDispatch = useDispatch();
	const allycode = profilesManagement$.profiles.activeAllycode.get();
	const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);
	const progress = useSelector(Optimize.selectors.selectProgress);
	const modAssignments = useSelector(
		Storage.selectors.selectModAssignmentsInActiveProfile,
	);
	const targetsNames = character.optimizerSettings.targets.map(
		(target) => target.name,
	);

	const cloneCharacter = () => structuredClone(character);
	const cloneOptimizationPlan = () => structuredClone(target);

	useMount(() => {
		target$.character.set(cloneCharacter());
		target$.target.set(
			target$.isInAdvancedEditMode.peek()
				? OptimizationPlan.normalize(cloneOptimizationPlan())
				: cloneOptimizationPlan(),
		);
		target$.uneditedTarget.set(cloneOptimizationPlan());
		const defaultTarget = characterSettings[character.baseID]
			? (characterSettings[character.baseID] as CharacterSettings).targets.find(
					(defaultTarget) => defaultTarget.name === target.name,
				)
			: null;
	});

	const missedGoalsSection = (modAssignments: ModSuggestion | null) => {
		if ((target$.target.targetStats.peek() || []).length === 0) {
			return;
		}

		const resultsInner = (() => {
			if (!areObjectsEquivalent(progress, {})) {
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
						<span>{targetStat.minimum ?? 0 > resultValue ? " ↓ " : " ↑ "}</span>
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
		dispatch(Optimize.thunks.optimizeMods());
	};

	const saveTarget = () => {
		let newTarget: OptimizationPlan.OptimizationPlan = target$.target.peek();
		if (target$.isInAdvancedEditMode.peek())
			newTarget = OptimizationPlan.denormalize(newTarget);
		const char = target$.character.peek();

		dispatch(
			CharacterEdit.thunks.changeMinimumModDots(
				char.baseID,
				char.optimizerSettings.minimumModDots,
			),
		);
		dispatch(CharacterEdit.thunks.unlockCharacter(char.baseID));
		dispatch(
			CharacterEdit.thunks.finishEditCharacterTarget(char.baseID, newTarget),
		);
	};

	return (
		// Determine whether the current optimization plan is a default (same name exists), user-defined (same name doesn't
		// exist), or custom (name is 'custom') This determines whether to display a "Reset target to default" button, a
		// "Delete target" button, or nothing.
		<Reactive.form
			className={
				"character-edit-form w-full flex flex-col flex-gap-2 items-stretch justify-center p-8"
			}
			noValidate={target$.isInAdvancedEditMode.get()}
			onSubmit={(e) => {
				console.log(
					`defaultTarget spped: ${target$.uneditedTarget.Speed.peek()}   isEdited: ${target$.isTargetChanged.peek()}`,
				);
				e.preventDefault();
				saveTarget();
				incrementalOptimization$.indicesByProfile[allycode].set(null);
				optimizerView$.view.set("basic");
			}}
		>
			<div className={"flex flex-gap-4 justify-around"}>
				<div className={"flex flex-gap-2 items-center"}>
					<CharacterAvatar character={character} />
					<Label>
						{baseCharacters[character.baseID]
							? baseCharacters[character.baseID].name
							: character.baseID}
					</Label>
				</div>
				<div className={"flex gap-2 justify-center items-center"}>
					<div className={"actions p-2 flex gap-2 justify-center"}>
						<Show
							if={() =>
								target$.target.name.get() !== "custom" &&
								target$.isTargetChanged.get()
							}
						>
							<Button
								type={"button"}
								onClick={() => {
									target$.target.set({ ...target$.uneditedTarget.peek() });
								}}
							>
								Reset target
							</Button>
						</Show>
						<Show
							if={() =>
								target$.target.name.get() !== "custom" &&
								target$.isDefaultTarget.get()
							}
						>
							<Button
								type={"button"}
								onClick={() => {
									dispatch(
										CharacterEdit.thunks.resetCharacterTargetToDefault(
											character.baseID,
											target$.target.name.get(),
										),
									);
									//                  target$.target.set({...target$.uneditedTarget.peek()});
								}}
							>
								Reset to default
							</Button>
						</Show>
						<Show
							if={() =>
								target$.target.name.get() !== "custom" &&
								!target$.isDefaultTarget.get() &&
								targetsNames.includes(target$.target.name.get())
							}
						>
							<Button
								type={"button"}
								id={"delete-button"}
								variant={"destructive"}
								onClick={() =>
									dispatch(
										CharacterEdit.thunks.deleteTarget(
											character.baseID,
											target.name,
										),
									)
								}
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
						<ReactiveButton
							$disabled={() => !target$.isTargetChanged.get()}
							type={"submit"}
						>
							Save
						</ReactiveButton>
					</div>
					<Label htmlFor={"plan-name"}>Target Name: </Label>
					<ReactiveInput
						className={"w-fit"}
						id={"plan-name"}
						type={"text"}
						$value={target$.target.name}
						onChange={(e: React.FormEvent<HTMLInputElement>) => {
							target$.target.name.set(e.currentTarget.value);
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
						<h3>Character-level options</h3>
						<div>
							<Label htmlFor="mod-dots" id={"mod-dots-label"}>
								Use only mods with at least&nbsp;
								<span>
									<ReactiveSelect
										name={"mod-dots"}
										$value={() =>
											target$.character.optimizerSettings.minimumModDots
												.get()
												?.toString() ?? 5
										}
										onValueChange={(value) => {
											target$.character.optimizerSettings.minimumModDots.set(
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
					<div>
						<StatWeightsWidget />
						{missedGoalsSection(
							modAssignments.find(
								(modAssignment: ModSuggestion) =>
									modAssignment.id === character.baseID,
							) ?? null,
						)}
					</div>
				</TabsContent>
				<TabsContent value="Primaries">
					<PrimaryStatRestrictionsWidget />
				</TabsContent>
				<TabsContent value="Sets">
					<SetRestrictionsWidget />
				</TabsContent>
				<TabsContent value="Stat Targets">
					<TargetStatsWidget />
				</TabsContent>
			</Tabs>
		</Reactive.form>
	);
});

CharacterEditForm.displayName = "CharacterEditForm";

export { CharacterEditForm };
