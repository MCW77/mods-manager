// react
import { useId } from "react";
import {
	Computed,
	observer,
	useValue,
	useObservable,
} from "@legendapp/state/react";

// state
import { beginBatch, endBatch } from "@legendapp/state";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const compilations$ = stateLoader$.compilations$;
const characters$ = stateLoader$.characters$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;
const lockedStatus$ = stateLoader$.lockedStatus$;

import { optimizeMods } from "#/modules/optimize/optimize";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { optimizerView$ } from "#/modules/optimizerView/state/optimizerView";
import { progress$ } from "#/modules/progress/state/progress";
import { review$ } from "#/modules/review/state/review";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

// component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowsRotate,
	faGears,
	faLock,
	faSave,
	faUnlock,
} from "@fortawesome/free-solid-svg-icons";

import { Button } from "#ui/button";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover";

import { HelpLink } from "#/modules/help/components/HelpLink";
import { MissedGoals } from "#/modules/progress/components/MissedGoals";
import OptimizerProgress from "#/modules/progress/components/OptimizerProgress";
import { SettingsLink } from "#/modules/settings/components/SettingsLink";

const CharacterActions: React.FC = observer(() => {
	const nameId = useId();
	const descriptionId = useId();
	const categoryId = useId();

	const baseCharacterById = useValue(characters$.baseCharacterById);
	const selectedCharacters = useValue(
		compilations$.defaultCompilation.selectedCharacters,
	);
	const modAssignments = useValue(
		compilations$.defaultCompilation.flatCharacterModdings,
	);

	const state$ = useObservable({
		isFormOpen: false,
		name: compilations$.activeCompilation.id.get(),
		description: compilations$.activeCompilation.description.get(),
		category: compilations$.activeCompilation.category.get(),
	});

	const isFormOpen = useValue(state$.isFormOpen);
	const compilationName = useValue(state$.name);
	const compilationDescription = useValue(state$.description);
	const compilationCategory = useValue(state$.category);

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
		<div className={"flex flex-wrap gap-2"}>
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
											<MissedGoals
												baseCharacterById={baseCharacterById}
												flatCharacterModdings={messages}
											/>,
											true,
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
				Optimize Mods
			</Button>
			<Popover open={isFormOpen} onOpenChange={state$.isFormOpen.set}>
				<PopoverTrigger className={"m-auto p-2"} render={<Button size="sm" />}>
					<FontAwesomeIcon icon={faSave} title={"Save"} />
					Save Compilation
				</PopoverTrigger>
				<PopoverContent className="w-80">
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
