// react
import { lazy } from "react";
import { observer, useObservable } from "@legendapp/state/react";

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

// component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faArrowsRotate,
	faGears,
	faLock,
	faSave,
	faUnlock,
} from "@fortawesome/free-solid-svg-icons";

/*
const OptimizerProgress = lazy(
	() => import("#/modules/progress/components/OptimizerProgress"),
);
*/

import { HelpLink } from "#/modules/help/components/HelpLink";
import { SettingsLink } from "#/modules/settings/components/SettingsLink";

import { Button } from "#ui/button";
import { Input } from "#ui/input";
import { Label } from "#ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "#ui/popover";

const CharacterActions: React.FC = observer(() => {
	const baseCharacterById = characters$.baseCharacterById.get();
	const selectedCharacters =
		compilations$.defaultCompilation.selectedCharacters.get();
	const modAssignments =
		compilations$.defaultCompilation.flatCharacterModdings.get();

	const state = useObservable({
		isOpen: false,
		name: compilations$.activeCompilation.id.get(),
		description: compilations$.activeCompilation.description.get(),
		category: compilations$.activeCompilation.category.get(),
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		beginBatch();
		if (
			!compilations$.compilationByIdForActiveAllycode.has(state.name.peek())
		) {
			compilations$.addCompilation(
				state.name.peek(),
				state.description.peek(),
				state.category.peek(),
			);
		}
		compilations$.compilationByIdForActiveAllycode[state.name.peek()].set(
			structuredClone(compilations$.defaultCompilation.peek()),
		);
		compilations$.compilationByIdForActiveAllycode[state.name.peek()].id.set(
			state.name.peek(),
		);
		compilations$.compilationByIdForActiveAllycode[
			state.name.peek()
		].description.set(state.description.peek());
		compilations$.compilationByIdForActiveAllycode[
			state.name.peek()
		].category.set(state.category.peek());
		compilations$.activeCompilationId.set(state.name.peek());
		state.isOpen.set(false);
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
						//						dialog$.show(<OptimizerProgress />, true);
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
			<Popover open={state.isOpen.get()} onOpenChange={state.isOpen.set}>
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
						<h4 className="font-medium text-sm text-slate-900">
							Save compilation
						</h4>
						<Label htmlFor={"compilation_save_form_name"}>Name</Label>
						<Input
							id="compilation_save_form_name"
							value={state.name.get()}
							onChange={(e) => state.name.set(e.target.value)}
							className="h-8 text-sm"
						/>
						<Label htmlFor={"compilation_save_form_description"}>
							Description
						</Label>
						<Input
							id="compilation_save_form_description"
							value={state.description.get()}
							onChange={(e) => state.description.set(e.target.value)}
							className="h-8 text-sm"
						/>
						<Label htmlFor={"compilation_save_form_category"}>Category</Label>
						<Input
							id="compilation_save_form_category"
							value={state.category.get()}
							onChange={(e) => state.category.set(e.target.value)}
							className="h-8 text-sm"
						/>
						<div className="flex justify-end space-x-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => state.isOpen.set(false)}
								className="h-8 px-3 text-xs"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								size="sm"
								className="h-8 px-3 text-xs bg-slate-900 text-white hover:bg-slate-700"
							>
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
