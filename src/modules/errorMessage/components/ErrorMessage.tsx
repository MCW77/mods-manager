// react
import React from "react";
import { Show, useValue } from "@legendapp/state/react";

// state
import { errorMessage$ } from "../state/errorMessage";

// components
import { WarningLabel } from "#/components/WarningLabel/WarningLabel";
import { DialogClose } from "#/components/custom/dialog";

const ErrorMessage = React.memo(() => {
	const errorMessage = useValue(errorMessage$);

	return (
		<div className={"flex flex-col gap-4"}>
			<div className={"flex flex-gap-4 items-center"}>
				<WarningLabel />
				<div>{errorMessage.message}</div>
			</div>
			<Show if={() => errorMessage.reason !== ""}>
				<div>{errorMessage.reason}</div>
			</Show>
			<Show if={() => errorMessage.solution !== ""}>
				<div>{errorMessage.solution}</div>
			</Show>
			<div className={"flex items-center justify-center"}>
				<DialogClose>Ok</DialogClose>
			</div>
		</div>
	);
});

ErrorMessage.displayName = "ErrorMessage";

export { ErrorMessage };
