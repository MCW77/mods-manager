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
	const [t] = useTranslation("global-ui");
	const scoreMinMax = use$(modsView$.activeFilter.speedRange);
	const value = scoreMinMax || [3, 31];

	return (
		<div className={"w-50 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2 text-[modgold]" htmlFor={"speed-filter1"}>
				Speed Range
			</Label>
			<div
				id={"speed-filter1"}
				className="flex flex-row gap-1 justify-center flex-wrap"
			>
				<Slider
					className="w-24"
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
		</div>
	);
};

SpeedFilter.displayName = "SpeedFilter";

export default SpeedFilter;
