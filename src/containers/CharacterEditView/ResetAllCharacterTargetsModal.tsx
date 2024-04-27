// react
import { useDispatch } from "react-redux";

// state
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";

import { dialog$ } from "#/modules/dialog/state/dialog";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";

//components
import { Button } from "#ui/button";

const ResetAllCharacterTargetsModal = () => {
	const dispatch: ThunkDispatch = useDispatch();

	return (
		<div className="w-[40em]">
			<h2>Are you sure you want to reset all characters to defaults?</h2>
			<p>
				This will <strong>not</strong> overwrite any new optimization targets
				that you've saved, but if you've edited any existing targets, or if any
				new targets have been created that have the same name as one that you've
				made, then it will be overwritten.
			</p>
			<div className={"actions"}>
				<Button type={"button"} onClick={() => dialog$.hide()}>
					Cancel
				</Button>
				<Button
					type={"button"}
					variant={"destructive"}
					onClick={() => {
						dialog$.hide();
						dispatch(CharacterEdit.thunks.resetAllCharacterTargets());
					}}
				>
					Reset
				</Button>
			</div>
		</div>
	);
};

ResetAllCharacterTargetsModal.displayName = "ResetAllCharacterTargetsModal";

export { ResetAllCharacterTargetsModal };
