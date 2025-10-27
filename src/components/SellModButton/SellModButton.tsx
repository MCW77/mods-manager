// react
import React from "react";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
// domain
import type { Mod } from "#/domain/Mod";

// components
import { Button, type ButtonProps } from "#ui/button";

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
