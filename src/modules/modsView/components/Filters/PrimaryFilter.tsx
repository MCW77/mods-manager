// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import {
	type PrimarySettingsPrimaries,
	primarySettingsPrimaries,
} from "../../domain/ModsViewOptions";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const PrimaryFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"p-x-1 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"primary-filter1"}>
				Primary Stat
			</Label>
			<div id={"primary-filter1"} className="flex flex-row gap-2 flex-wrap">
				{primarySettingsPrimaries.map((primary: PrimarySettingsPrimaries) => {
					const inputName = `primary-filter-${primary}`;

					return (
						<Memo key={inputName}>
							{() => {
								const primaryState = use$(
									modsView$.activeFilter.primary[primary],
								);
								const value = primaryState || 0;
								const className =
									value === 1
										? "border-inset bg-[#000040]/100"
										: value === -1
											? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500"
											: "text-slate-400";

								return (
									<Button
										className={className}
										size="xs"
										variant={"outline"}
										onClick={() =>
											modsView$.cycleState("primary", primary.toString())
										}
									>
										{primary}
									</Button>
								);
							}}
						</Memo>
					);
				})}
			</div>
			<SetAllButtonGroup filterKey="primary" />
		</div>
	);
};

PrimaryFilter.displayName = "PrimaryFilter";

export default PrimaryFilter;
