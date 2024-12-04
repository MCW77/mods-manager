// state
import { Memo, observer } from "@legendapp/state/react";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { modMove$ } from "#/modules/modMove/state/modMove";

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
						console.log(`index: ${modMove$.status.progress.index.get()}`);
						return (
							<Progress
								value={modMove$.status.progress.index.get()}
								max={modMove$.status.progress.count.get()}
							/>
						);
					}}
				</Memo>
				<Memo>{() => <>{modMove$.status.message.get()}</>}</Memo>
			</div>
			<div>
				<Button
					type={"button"}
					variant={"destructive"}
					onClick={() => {
						dialog$.hide();
						modMove$.cancelModMove();
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
