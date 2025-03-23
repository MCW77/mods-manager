// state
import { Memo, observer, use$ } from "@legendapp/state/react";

import { dialog$ } from "#/modules/dialog/state/dialog";
import { modMove$ } from "#/modules/modMove/state/modMove";

// components
import { Button } from "#ui/button";
import { Progress } from "#ui/progress";

const ModMoveProgress: React.FC = observer(() => {
	const count = use$(modMove$.status.progress.count);
	const index = use$(modMove$.status.progress.index);
	const message = use$(modMove$.status.message);

	return (
		<div className={"flex flex-col gap-2"}>
			<h3>Moving Your Mods...</h3>
			<div>
				<Memo>
					{() => {
						return <Progress value={index} max={count} />;
					}}
				</Memo>
				<Memo>{() => <>{message}</>}</Memo>
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
