// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";
import { modsView$ } from "../../state/modsView";

// domain
import type { TierSettings } from "../../domain/ModsViewOptions";
import * as ModConsts from "#/domain/constants/ModConsts";

// components
import { SetAllButtonGroup } from "../SetAllButtonGroup";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const tierColorByTier: Record<keyof TierSettings, string> = {
  "1": "text-[modgray]",
  "2": "text-[modgreen]",
  "3": "text-[modblue]",
  "4": "text-[modpurple]",
  "5": "text-[modgold]",
};

const TierFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const tierConfig: TierSettings = modsView$.activeFilter.tier.get();

		return (
			<div className={"w-24 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2 text-[modgold]" htmlFor={"tier-filter1"}>
					Tier
				</Label>
				<div id={"tier-filter1"} className="flex flex-row gap-1 justify-center flex-wrap">
					{Object.keys(tierConfig).map((tier: keyof TierSettings) => {
						const inputName = `tier-filter-${tier}`;
						const value = tierConfig[tier] || 0;
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
								key={inputName}
								size="xs"
								variant={"outline"}
								onClick={() => modsView$.cycleState("tier", tier.toString())}
							>
								{String.fromCharCode(70-Number(tier))}
							</Button>
						);
					})}
				</div>
				<SetAllButtonGroup filterKey="tier" />
			</div>
		);
	}),
);

TierFilter.displayName = "TierFilter";

export { TierFilter };
