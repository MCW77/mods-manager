// react
import { useTranslation } from "react-i18next";

// state
import { use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// components
import { Label } from "#ui/label";
import { Slider } from "#ui/slider";
import { modScores } from "#/domain/Mod";

const ScoreFilter = () => {
	const [t] = useTranslation("global-ui");
	const score = use$(() =>
		modScores.find(
			(modScore) =>
				modScore.name ===
				modsView$.activeViewSetupInActiveCategory.modScore.get(),
		),
	);
	const scoreMinMax = use$(modsView$.activeFilter.score);
	const max = score?.isFlatOrPercentage === "IsPercentage" ? 100 : 800;
	const value = scoreMinMax || [0, 100];

	return (
		<div className={"w-50 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2 text-[modgold]" htmlFor={"score-filter1"}>
				Score
			</Label>
			<div
				id={"score-filter1"}
				className="flex flex-row gap-1 justify-center flex-wrap"
			>
				<Slider
					className="w-50"
					max={max}
					min={0}
					step={1}
					value={value}
					onValueChange={(newValues: [number, number]) => {
						const [newMin, newMax] = newValues;
						if (newMin <= newMax) {
							modsView$.activeFilter.score.set(newValues);
						} else {
							modsView$.activeFilter.score.set([newMax, newMax]);
						}
					}}
				/>
			</div>
		</div>
	);
};

ScoreFilter.displayName = "ScoreFilter";

export default ScoreFilter;
