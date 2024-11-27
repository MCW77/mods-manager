// react
import React, { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import type { PrimarySettings } from "../../domain/ModsViewOptions";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const PrimaryFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const primaryConfig: PrimarySettings = modsView$.activeFilter.primary.get();

		return (
			<div className={"p-x-1 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2" htmlFor={"primary-filter1"}>
					Primary Stat
				</Label>
				<div id={"primary-filter1"} className="flex flex-row gap-2 flex-wrap">
					{Object.keys(primaryConfig).map((primary: keyof PrimarySettings) => {
						const inputName = `primary-filter-${primary}`;
						const value = primaryConfig[primary] || 0;
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
									modsView$.cycleState("primary", primary.toString())
								}
							>
								{primary}
							</Button>
						);
					})}
				</div>
				<SetAllButtonGroup filterKey="primary" />
			</div>
		);
	}),
);

PrimaryFilter.displayName = "PrimaryFilter";

export default PrimaryFilter;
