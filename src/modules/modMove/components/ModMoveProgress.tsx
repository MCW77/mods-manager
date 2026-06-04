// react
import { Computed, observer, useValue } from "@legendapp/state/react";

// state
import { modMove$ } from "#/modules/modMove/state/modMove";

// components
import { Button } from "#ui/button";
import {
	DialogClose,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#ui/dialog";
import { Progress } from "#ui/progress";

const ModMoveProgress: React.FC = observer(() => {
	return (
		<>
			<DialogHeader>
				<DialogTitle>Moving Your Mods...</DialogTitle>
				<DialogDescription />
			</DialogHeader>
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
			<DialogFooter className="sm:justify-center pb-1">
				<DialogClose
					render={
						<Button
							type={"button"}
							variant={"destructive"}
							onClick={() => {
								modMove$.cancelModMove();
							}}
						>
							Cancel
						</Button>
					}
				/>
			</DialogFooter>
		</>
	);
});

ModMoveProgress.displayName = "ModMoveProgress";

export default ModMoveProgress;
