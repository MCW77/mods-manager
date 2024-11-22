// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

const { modsView$ } = await import("../../state/modsView");

// domain
import type { EquippedSettings } from "../../domain/ModsViewOptions";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const EquippedFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const equippedConfig: EquippedSettings =
			modsView$.activeFilter.equipped.get();
		const value = equippedConfig.equipped || 0;
		const className =
			value === 1
				? "border-inset bg-[#000040]/100"
				: value === -1
					? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500"
					: "text-slate-400";

		return (
			<div className={"w-24 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2" htmlFor={"equipped-filter1"}>
					Equipped
				</Label>
				<div id={"equipped-filter1"} className="flex flex-row gap-2 flex-wrap">
					<Button
						className={className}
						key={"equipped-filter-equipped"}
						size="xs"
						variant={"outline"}
						onClick={() => modsView$.cycleState("equipped", "equipped")}
					>
						{"equipped"}
					</Button>
				</div>
			</div>
		);
	}),
);

EquippedFilter.displayName = "EquippedFilter";

export { EquippedFilter };
