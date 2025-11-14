// react
import React from "react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const profilesManagement$ = stateLoader$.profilesManagement$;
// domain
import type { Mod } from "#/domain/Mod.js";

// components
import { Button, type ButtonProps } from "#ui/button.jsx";

type ComponentProps = {
	mod: Mod;
} & ButtonProps;

const SellModButton = React.memo(({ mod, ...buttonProps }: ComponentProps) => {
	return (
		<Button
			type={"button"}
			variant={"destructive"}
			size={"xxs"}
			className={"absolute top-0 right-0 m-2"}
			onClick={() => {
				profilesManagement$.deleteMod(mod.id);
			}}
			{...buttonProps}
		>
			X
		</Button>
	);
});

SellModButton.displayName = "SellModButton";

export default SellModButton;
