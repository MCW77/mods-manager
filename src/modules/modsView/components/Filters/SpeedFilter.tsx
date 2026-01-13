// react
import { useTranslation } from "react-i18next";

// state
import { useObservable, useValue } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// components
import { Slider } from "#/components/reactive/Slider";
import { Label } from "#ui/label";

const SpeedFilter = () => {
	const [t] = useTranslation("explore-ui");
	const scoreMinMax = useValue(() => {
		const activeFilter = modsView$.activeFilter.get();
		return activeFilter.speedRange;
	});
	const scoreRange$ = useObservable(() => {
		const activeFilter = modsView$.activeFilter.get();
		if (!activeFilter?.speedRange) {
			return [0, 31];
		}
		return activeFilter.speedRange;
	});
	const value = scoreMinMax || [0, 31];

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
				$value={scoreRange$}
				onValueChange={(newValues: number[]) => {
					const [newMin, newMax] = newValues;
					if (newMin <= newMax) {
						modsView$.activeFilter.speedRange.set([newMin, newMax]);
					} else {
						modsView$.activeFilter.speedRange.set([newMax, newMax]);
					}
				}}
			/>
			<div className="text-xs text-gray-400">
				{value[0]}-{value[1]}
			</div>
		</div>
	);
};

SpeedFilter.displayName = "SpeedFilter";

export default SpeedFilter;
