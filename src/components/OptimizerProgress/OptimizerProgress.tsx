// react
import { useDispatch, useSelector } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

// state
import { dialog$ } from "#/modules/dialog/state/dialog";
import { incrementalOptimization$ } from "#/modules/incrementalOptimization/state/incrementalOptimization";
import { isBusy$ } from "#/modules/busyIndication/state/isBusy";

// modules
import { Optimize } from "#/state/modules/optimize";

// components
import { CharacterAvatar } from "#/components/CharacterAvatar/CharacterAvatar";
import { Button } from "#ui/button";

const OptimizerProgress = () => {
	const dispatch: ThunkDispatch = useDispatch();
	const progress = useSelector(Optimize.selectors.selectProgress);
	const isIncremental = incrementalOptimization$.activeIndex.peek() !== null;

	const cancel = (closeModal: boolean) => {
		dispatch(Optimize.thunks.cancelOptimizer());
		isBusy$.set(false);
		if (closeModal) {
			dialog$.hide();
		}
	};

	return (
		<div className="w-600px">
			<h3 className="text-[#a35ef9]">Optimizing Your Mods...</h3>
			<div>
				{progress.character && (
					<div>
						<CharacterAvatar character={progress.character} />
					</div>
				)}
				<div className={"step"}>{progress.step}</div>
				<div
					className={
						"progress h-[1em] w-[17em] m-x-[.5em] m-y-auto rounded-lg border-1px border-solid border-[#32cd32] p-0 overflow-hidden"
					}
				>
					<span
						className={
							"progress-bar block h-full bg-[length:2.828em_1em] bg-repeat-x bg-gradient-to-br from-[#8fff3a] via-[#46801a] to-[#8fff3a] transition-[width] duration-500"
						}
						style={{ width: `${progress.progress}%` }}
					/>
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
};

OptimizerProgress.displayName = "OptimizerProgress";

export { OptimizerProgress };
