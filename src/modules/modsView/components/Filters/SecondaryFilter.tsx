// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

const { modsView$ } = await import("../../state/modsView");

// domain
import type { SecondarySettings } from "../../domain/ModsViewOptions";

// components
import { SetAllButtonGroup } from "../SetAllButtonGroup";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const SecondaryFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const secondaryConfig: SecondarySettings =
			modsView$.activeFilter.secondary.get();

		return (
			<div className={"p-x-1 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2" htmlFor={"secondary-filter1"}>
					Secondary Stat
				</Label>
				<div id={"secondary-filter1"} className="flex flex-row gap-2 flex-wrap">
					{Object.keys(secondaryConfig).map(
						(secondary: keyof SecondarySettings) => {
							const inputName = `secondary-filter-${secondary}`;
							const value = secondaryConfig[secondary] || 0;
							const className =
								value === 1
									? "border-inset bg-[#000040]/100"
									: value === -1
										? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500"
										: "text-slate-400";

							return (
								<Button
									className={className}
									key={inputName}
									size="xs"
									variant={"outline"}
									onClick={() =>
										modsView$.cycleState("secondary", secondary.toString())
									}
								>
									{secondary}
								</Button>
							);
						},
					)}
				</div>
				<SetAllButtonGroup filterKey="secondary" />
			</div>
		);
	}),
);

SecondaryFilter.displayName = "SecondaryFilter";

export { SecondaryFilter };
