// react
import React from "react";
import { useDispatch } from "react-redux";
import type { ThunkDispatch } from "#/state/reducers/modsOptimizer";


// modules

import { Storage } from "#/state/modules/storage";

// domain
import type { Mod } from "#/domain/Mod";

// components
import { Button } from "#ui/button";

type ComponentProps = {
	mod: Mod;
};

const SellModButton = React.memo(({ mod }: ComponentProps) => {
	const dispatch: ThunkDispatch = useDispatch();

	return (
		<Button
			type={"button"}
			variant={"destructive"}
			size={"xxs"}
			className={"absolute top-0 right-0 m-2"}
			onClick={() => {
				dispatch(Storage.thunks.deleteMod(mod));
			}}
		>
			X
		</Button>
	);
});

SellModButton.displayName = "SellModButton";

export { SellModButton };
