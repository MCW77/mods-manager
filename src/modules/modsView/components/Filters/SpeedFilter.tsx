// react
import { useTranslation } from "react-i18next";

// state
import { use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// components
import { Label } from "#ui/label";
import { Slider } from "#ui/slider";

const SpeedFilter = () => {
	const [t] = useTranslation("explore-ui");
	const scoreMinMax = use$(() => {
		const activeFilter = modsView$.activeFilter.get();
		return activeFilter.speedRange;
	});
	const value = scoreMinMax || [3, 31];

	return (
		<div className={"w-50 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"speed-filter1"}>
				{t("filter.SpeedRangeHeadline")}
			</Label>
			<Slider
				className="w-24"
				id={"speed-filter1"}
				max={31}
				min={0}
				step={1}
				value={value}
				onValueChange={(newValues: [number, number]) => {
					const [newMin, newMax] = newValues;
					if (newMin <= newMax) {
						modsView$.activeFilter.speedRange.set(newValues);
					} else {
						modsView$.activeFilter.speedRange.set([newMax, newMax]);
					}
				}}
			/>
		</div>
	);
};

SpeedFilter.displayName = "SpeedFilter";

export default SpeedFilter;
