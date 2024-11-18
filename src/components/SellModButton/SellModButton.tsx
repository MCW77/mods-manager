// react
import React from "react";

// domain
import type { Mod } from "#/domain/Mod";

// components
import { Button } from "#ui/button";
import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

type ComponentProps = {
	mod: Mod;
};

const SellModButton = React.memo(({ mod }: ComponentProps) => {
	return (
		<Button
			type={"button"}
			variant={"destructive"}
			size={"xxs"}
			className={"absolute top-0 right-0 m-2"}
			onClick={() => {
				profilesManagement$.deleteMod(mod.id);
			}}
		>
			X
		</Button>
	);
});

SellModButton.displayName = "SellModButton";

export { SellModButton };
