// react
import { lazy } from "react";

// state
import {
	Memo,
	observer,
	reactive,
	Show,
	use$,
	useObservable,
} from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const profilesManagement$ = stateLoader$.profilesManagement$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;

const { cancelOptimizer } = await import("#/modules/optimize/optimize.js");

import { dialog$ } from "#/modules/dialog/state/dialog.js";
import { progress$ } from "../state/progress.js";

// domain
import type * as Character from "#/domain/Character.js";

// components
const CharacterAvatar = lazy(
	() => import("#/components/CharacterAvatar/CharacterAvatar.jsx"),
);

import { Button } from "#ui/button.jsx";
import { Label } from "#ui/label.jsx";
import { Progress } from "#ui/progress.jsx";

const ReactiveProgress = reactive(Progress);

const OptimizerProgress: React.FC = observer(() => {
	const characterById = use$(profilesManagement$.activeProfile.characterById);
	const character$ = useObservable<Character.Character | undefined>(() => {
		const charId = progress$.optimizationStatus.character.get();
		return charId === "" ? undefined : characterById[charId];
	});
	const isIncremental = incrementalOptimization$.activeIndex.peek() !== null;

	const cancel = (closeModal: boolean) => {
		cancelOptimizer();
		if (closeModal) {
			dialog$.hide();
		}
	};

	return (
		<div className="w-600px">
			<h3 className="text-[#a35ef9]">Optimizing Your Mods...</h3>
			<div className={"flex flex-col gap-2"}>
				<Show ifReady={character$}>
					<Memo>
						{() => {
							const character = use$(character$);
							return <CharacterAvatar character={character} />;
						}}
					</Memo>
				</Show>
				<div className={"step"}>
					<Memo>
						{() => {
							const message = use$(progress$.optimizationStatus.message);
							return message;
						}}
					</Memo>
				</div>
				<div>
					<Label>Character progress</Label>
					<ReactiveProgress
						$value={() =>
							Math.trunc(
								100 *
									((progress$.optimizationStatus.characterIndex.get() + 1) /
										progress$.optimizationStatus.characterCount.get()),
							)
						}
					/>
				</div>
				<div>
					<Label>
						Sets progress:{" "}
						<Memo>
							{() => {
								const joinedSets = use$(() =>
									progress$.optimizationStatus.sets.get().join(" - "),
								);
								return joinedSets;
							}}
						</Memo>
					</Label>
					<ReactiveProgress
						$value={() =>
							Math.trunc(
								100 *
									(progress$.optimizationStatus.setsIndex.get() /
										progress$.optimizationStatus.setsCount.get()),
							)
						}
					/>
				</div>
				<div>
					<Label>
						TargetStats progress:{" "}
						<Memo>
							{() => {
								const targetStat = use$(
									progress$.optimizationStatus.targetStat,
								);
								return targetStat;
							}}
						</Memo>
					</Label>
					<ReactiveProgress
						$value={() =>
							Math.trunc(
								100 *
									(progress$.optimizationStatus.targetStatIndex.get() /
										progress$.optimizationStatus.targetStatCount.get()),
							)
						}
					/>
				</div>
				<div>
					<Label>permutations progress</Label>
					<ReactiveProgress $value={progress$.optimizationStatus.progress} />
				</div>
			</div>
			<div>
				<Button
					type={"button"}
					variant={"destructive"}
					className={""}
					onClick={() => cancel(!isIncremental)}
				>
					Cancel
				</Button>
			</div>
		</div>
	);
});

OptimizerProgress.displayName = "OptimizerProgress";

export default OptimizerProgress;
