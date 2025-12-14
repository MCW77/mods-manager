// react
import { useTranslation } from "react-i18next";

// state
import { useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { modScores } from "#/domain/Mod";

// components
import { Label } from "#ui/label";
import { Slider } from "#ui/slider";

const ScoreFilter = () => {
	const [t] = useTranslation("explore-ui");
	const score = useValue(() =>
		modScores.find(
			(modScore) =>
				modScore.name ===
				modsView$.activeViewSetupInActiveCategory.modScore.get(),
		),
	);
	const scoreMinMax = useValue(() => {
		const activeFilter = modsView$.activeFilter.get();
		return activeFilter.score;
	});
	const max = score?.isFlatOrPercentage === "IsPercentage" ? 100 : 800;
	const value = scoreMinMax || [0, 100];

	return (
		<div className={"w-50 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"score-filter1"}>
				{t("filter.ScoreHeadline")}
			</Label>
			<Slider
				className="w-50"
				id={"score-filter1"}
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
	);
};

ScoreFilter.displayName = "ScoreFilter";

export default ScoreFilter;
