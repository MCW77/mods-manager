// state
import {
	Memo,
	observer,
	reactive,
	Show,
	useValue,
	useObservable,
} from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const incrementalOptimization$ = stateLoader$.incrementalOptimization$;

import { cancelOptimizer } from "#/modules/optimize/optimize";

import { progress$ } from "../state/progress";

// domain
import type * as Character from "#/domain/Character";

// components
import CharacterAvatar from "#/components/CharacterAvatar/CharacterAvatar";

import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";
import { Label } from "#ui/label";
import { Progress } from "#ui/progress";

const ReactiveProgress = reactive(Progress);

const OptimizerProgress: React.FC = observer(() => {
	const characterById = useValue(
		profilesManagement$.activeProfile.characterById,
	);
	const character$ = useObservable<Character.Character | undefined>(() => {
		const charId = progress$.optimizationStatus.character.get();
		return charId === "" ? undefined : characterById[charId];
	});
	const $isIncremental = useObservable(() => {
		const activeIndex = incrementalOptimization$.activeIndex.get();
		return activeIndex !== undefined && activeIndex !== null;
	});

	return (
		<Show
			if={$isIncremental}
			else={
				<>
					<DialogHeader>
						<DialogTitle className="text-[#a35ef9]">
							Optimizing Your Mods...
						</DialogTitle>
						<DialogDescription />
					</DialogHeader>
					<div className={"flex flex-col gap-2"}>
						<Show ifReady={character$}>
							<Memo>
								{() => {
									const character = useValue(character$);
									return (
										<CharacterAvatar
											character={character}
											displayBadges={false}
											displayStars={false}
										/>
									);
								}}
							</Memo>
						</Show>
						<div className={"step"}>
							<Memo>
								{() => {
									const message = useValue(
										progress$.optimizationStatus.message,
									);
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
										const joinedSets = useValue(() =>
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
										const targetStat = useValue(
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
							<ReactiveProgress
								$value={progress$.optimizationStatus.progress}
							/>
						</div>
					</div>
					<DialogFooter className="sm:justify-center">
						<DialogClose
							render={
								<Button
									type={"button"}
									variant={"destructive"}
									onClick={() => cancelOptimizer()}
								>
									Cancel
								</Button>
							}
						/>
					</DialogFooter>
				</>
			}
		>
			<div className="flex flex-col gap-2 max-w-600px">
				<h3 className="text-[#a35ef9]">Optimizing Your Mods...</h3>
				<div className={"flex flex-col gap-2"}>
					<Show ifReady={character$}>
						<Memo>
							{() => {
								const character = useValue(character$);
								return (
									<CharacterAvatar
										character={character}
										displayBadges={false}
										displayStars={false}
									/>
								);
							}}
						</Memo>
					</Show>
					<div className={"step"}>
						<Memo>
							{() => {
								const message = useValue(progress$.optimizationStatus.message);
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
									const joinedSets = useValue(() =>
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
									const targetStat = useValue(
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
						onClick={() => cancelOptimizer()}
					>
						Cancel
					</Button>
				</div>
			</div>
		</Show>
	);
});

OptimizerProgress.displayName = "OptimizerProgress";

export default OptimizerProgress;
