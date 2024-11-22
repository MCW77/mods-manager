// state
import { Memo, observer } from "@legendapp/state/react";

const { hotutils$ } = await import("#/modules/hotUtils/state/hotUtils");

import { dialog$ } from "#/modules/dialog/state/dialog";

// components
import { Button } from "#ui/button";
import { Progress } from "#ui/progress";

const ModMoveProgress: React.FC = observer(() => {
	return (
		<div className={"flex flex-col gap-2"}>
			<h3>Moving Your Mods...</h3>
			<div>
				<Memo>
					{() => {
						console.log(`index: ${hotutils$.moveStatus.progress.index.get()}`);
						return (
							<Progress
								value={hotutils$.moveStatus.progress.index.get()}
								max={hotutils$.moveStatus.progress.count.get()}
							/>
						);
					}}
				</Memo>
				<Memo>{() => <>{hotutils$.moveStatus.message.get()}</>}</Memo>
			</div>
			<div>
				<Button
					type={"button"}
					variant={"destructive"}
					onClick={() => {
						dialog$.hide();
						hotutils$.cancelModMove();
					}}
				>
					Cancel
				</Button>
			</div>
		</div>
	);
});

ModMoveProgress.displayName = "ModMoveProgress";

export default ModMoveProgress;
