// react
import { useTranslation } from "react-i18next";

// state
import { Memo, useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// domain
import { getFilterSelectionStyles } from "../../domain/FilterSelectionStyles";
import {
	type RaritySettingsRarities,
	raritySettingsRarities,
} from "../../domain/ModsViewOptions";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";

function RarityButton({ rarity }: { rarity: RaritySettingsRarities }) {
	const rarityState = useValue(() => {
		const activeFilter = modsView$.activeFilter.get();
		return activeFilter.rarity[rarity];
	});
	const value = rarityState || 0;
	const className = getFilterSelectionStyles(value);

	return (
		<Button
			className={className}
			size="xs"
			variant={"outline"}
			onClick={() => modsView$.cycleState("rarity", rarity.toString())}
		>
			{"•".repeat(Number(rarity))}
		</Button>
	);
}

const RarityFilter = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"rarity-filter1"}>
				{t("filter.RarityHeadline")}
			</Label>
			<div
				id={"rarity-filter1"}
				className="flex flex-col gap-2 justify-center flex-wrap"
			>
				{raritySettingsRarities.map((rarity: RaritySettingsRarities) => {
					const inputName = `rarity-filter-${rarity}`;

					return (
						<Memo key={inputName}>
							{() => <RarityButton rarity={rarity} />}
						</Memo>
					);
				})}
			</div>
		</div>
	);
};

RarityFilter.displayName = "RarityFilter";

export default RarityFilter;
