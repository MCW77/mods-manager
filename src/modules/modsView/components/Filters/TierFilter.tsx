// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { getFilterSelectionStyles } from "../../domain/FilterSelectionStyles";
import {
	type TierSettingsTiers,
	tierSettingsTiers,
} from "../../domain/ModsViewOptions";
import * as ModConsts from "#/domain/constants/ModConsts";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

function TierButton({ tier }: { tier: TierSettingsTiers }) {
	const tierState = useValue(() => {
		const activeFilter = modsView$.activeFilter.get();
		return activeFilter.tier[tier];
	});
	const value = tierState || 0;
	const tierColor = ModConsts.tiersMap.get(Number(tier));
	const stateCSS = getFilterSelectionStyles(value, tierColor);

	return (
		<Button
			className={stateCSS}
			size="xs"
			variant={"outline"}
			onClick={() => modsView$.cycleState("tier", tier.toString())}
		>
			{String.fromCharCode(70 - Number(tier))}
		</Button>
	);
}

const TierFilter = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"tier-filter1"}>
				{t("filter.TierHeadline")}
			</Label>
			<div
				id={"tier-filter1"}
				className="flex flex-row gap-1 justify-center flex-wrap"
			>
				{tierSettingsTiers.map((tier: TierSettingsTiers) => {
					const inputName = `tier-filter-${tier}`;

					return (
						<Memo key={inputName}>{() => <TierButton tier={tier} />}</Memo>
					);
				})}
			</div>
			<SetAllButtonGroup filterKey="tier" />
		</div>
	);
};

TierFilter.displayName = "TierFilter";

export default TierFilter;
