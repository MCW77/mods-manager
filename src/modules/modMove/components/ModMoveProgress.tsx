// state
import { Computed, observer, use$ } from "@legendapp/state/react";

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
				<Computed>
					{() => {
						const count = use$(modMove$.status.progress.count);
						const index = use$(modMove$.status.progress.index);

						if (count === 0) {
							return <Progress value={0} />;
						}
						return <Progress value={100 * (index / count)} />;
					}}
				</Computed>
				<Computed>
					{() => {
						const message = use$(modMove$.status.message);

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
