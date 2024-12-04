// react
import React from "react";
import { Show, observer } from "@legendapp/state/react";

// state
import { errorMessage$ } from "../state/errorMessage";

// components
import { WarningLabel } from "#/components/WarningLabel/WarningLabel";
import { DialogClose } from "#ui/dialog";

const ErrorMessage = observer(
	React.memo(() => {
		return (
			<div className={"flex flex-col gap-4"}>
				<div className={"flex flex-gap-4 items-center"}>
					<WarningLabel />
					<div>{errorMessage$.message.get()}</div>
				</div>
				<Show if={() => errorMessage$.reason.get() !== ""}>
					<div>{errorMessage$.reason.get()}</div>
				</Show>
				<Show if={() => errorMessage$.solution.get() !== ""}>
					<div>{errorMessage$.solution.get()}</div>
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
