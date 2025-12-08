// state
import { Computed, observer, useValue } from "@legendapp/state/react";

import { dialog$ } from "#/modules/dialog/state/dialog.js";
import { modMove$ } from "#/modules/modMove/state/modMove.js";

// components
import { Button } from "#ui/button.jsx";
import { Progress } from "#ui/progress.jsx";

const ModMoveProgress: React.FC = observer(() => {
	return (
		<div className={"flex flex-col gap-2"}>
			<h3>Moving Your Mods...</h3>
			<div>
				<Computed>
					{() => {
						const count = useValue(modMove$.status.progress.count);
						const index = useValue(modMove$.status.progress.index);

						if (count === 0) {
							return <Progress value={0} />;
						}
						return <Progress value={100 * (index / count)} />;
					}}
				</Computed>
				<Computed>
					{() => {
						const message = useValue(modMove$.status.message);

						return <>{message}</>;
					}}
				</Computed>
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
