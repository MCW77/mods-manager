// state
import {
	observer,
	reactive,
	Show,
	useObservable,
} from "@legendapp/state/react";

const { profilesManagement$ } = await import(
	"#/modules/profilesManagement/state/profilesManagement"
);
const { incrementalOptimization$ } = await import(
	"#/modules/incrementalOptimization/state/incrementalOptimization"
);

import { dialog$ } from "#/modules/dialog/state/dialog";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";
import { progress$ } from "../state/progress";

// modules
import { Optimize } from "#/state/modules/optimize";

// domain
import type * as Character from "#/domain/Character";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { Progress } from "#ui/progress";

const ReactiveProgress = reactive(Progress);

const OptimizerProgress: React.FC = observer(() => {
	const characterById = profilesManagement$.activeProfile.characterById.get();
	const character$ = useObservable<Character.Character | undefined>(() => {
		const charId = progress$.optimizationStatus.character.get();
		return charId === "" ? undefined : characterById[charId];
	});
	const isIncremental = incrementalOptimization$.activeIndex.peek() !== null;

	const cancel = (closeModal: boolean) => {
		Optimize.thunks.cancelOptimizer();
		isBusy$.set(false);
		if (closeModal) {
			dialog$.hide();
		}
	};

	return (
		<div className="w-600px">
			<h3 className="text-[#a35ef9]">Optimizing Your Mods...</h3>
			<div className={"flex flex-col gap-2"}>
				<Show ifReady={character$}>
					{(condition) => <CharacterAvatar character={character$.get()} />}
				</Show>
				<div className={"step"}>
					{progress$.optimizationStatus.message.get()}
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
						Sets progress: {progress$.optimizationStatus.sets.get().join(" - ")}
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
						{progress$.optimizationStatus.targetStat.get()}
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

export { OptimizerProgress };
