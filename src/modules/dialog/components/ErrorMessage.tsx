// react
import React from "react";
import { Show, observer } from "@legendapp/state/react";

// state
import { dialog$ } from "../state/dialog";

// components
import { WarningLabel } from "#/components/WarningLabel/WarningLabel";
import { DialogClose } from "#ui/dialog";

const ErrorMessage = observer(
	React.memo((props: {}) => {
		return (
			<div className={"flex flex-col gap-4"}>
				<div className={"flex flex-gap-4 items-center"}>
					<WarningLabel />
					<div>{dialog$.error.get()}</div>
				</div>
				<Show if={() => dialog$.reason.get() !== ""}>
					<div>{dialog$.reason.get()}</div>
				</Show>
				<Show if={() => dialog$.solution.get() !== ""}>
					<div>{dialog$.solution.get()}</div>
				</Show>
				<div className={"flex items-center justify-center"}>
					<DialogClose>Ok</DialogClose>
				</div>
			</div>
		);
	}),
);

ErrorMessage.displayName = "ErrorMessage";

export { ErrorMessage };
