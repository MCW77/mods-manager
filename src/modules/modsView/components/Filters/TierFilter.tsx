// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import {
	type TierSettingsTiers,
	tierSettingsTiers,
} from "../../domain/ModsViewOptions";
import * as ModConsts from "#/domain/constants/ModConsts";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const tierColorByTier: Record<TierSettingsTiers, string> = {
	"1": "text-[modgray]",
	"2": "text-[modgreen]",
	"3": "text-[modblue]",
	"4": "text-[modpurple]",
	"5": "text-[modgold]",
};

const TierFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2 text-[modgold]" htmlFor={"tier-filter1"}>
				Tier
			</Label>
			<div
				id={"tier-filter1"}
				className="flex flex-row gap-1 justify-center flex-wrap"
			>
				{tierSettingsTiers.map((tier: TierSettingsTiers) => {
					const inputName = `tier-filter-${tier}`;

					return (
						<Memo key={inputName}>
							{() => {
								const tierState = use$(() => {
									const activeFilter = modsView$.activeFilter.get();
									return activeFilter.tier[tier];
								});
								const value = tierState || 0;
								const stateCSS =
									value === 1
										? "border-inset bg-[#000040]/100"
										: value === -1
											? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500 dark:bg-[#400000]/100 dark:border-[#800000]/100 dark:text-red-500"
											: "text-slate-400 opacity-30";
								const tierColor = ModConsts.tiersMap.get(Number(tier));
								const className = `${stateCSS} ${tierColor}`;

								return (
									<Button
										className={className}
										size="xs"
										variant={"outline"}
										onClick={() =>
											modsView$.cycleState("tier", tier.toString())
										}
									>
										{String.fromCharCode(70 - Number(tier))}
									</Button>
								);
							}}
						</Memo>
					);
				})}
			</div>
			<SetAllButtonGroup filterKey="tier" />
		</div>
	);
};

TierFilter.displayName = "TierFilter";

export default TierFilter;
