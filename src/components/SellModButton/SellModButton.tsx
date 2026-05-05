// react
import React from "react";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
// domain
import type { Mod } from "#/domain/Mod";

// components
import { Button } from "#ui/button";
import type { Button as ButtonPrimitive } from "@base-ui/react/button";

type ComponentProps = {
	mod: Mod;
} & ButtonPrimitive.Props;

const SellModButton = React.memo(({ mod, ...buttonProps }: ComponentProps) => {
	return (
		<Button
			type={"button"}
			variant={"destructive"}
			size={"xs"}
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
