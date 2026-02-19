// react
import { useTranslation } from "react-i18next";

// state
import { useValue } from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// domain
import { modScorers } from "#/modules/modScores/domain/ModScorer";

// components
import { Slider } from "#/components/reactive/Slider";
import { Label } from "#ui/label";

const ScoreFilter = () => {
	const [t] = useTranslation("explore-ui");
	const modScorer = useValue(() =>
		modScorers.get(modsView$.activeViewSetupInActiveCategory.modScore.get()),
	);
	const max = modScorer?.isFlatOrPercentage === "IsPercentage" ? 100 : 800;
	const scoreRange = useValue(() => {
		const activeFilter = modsView$.activeFilter.get();
		if (!activeFilter?.score) {
			return [0, max];
		}
		return activeFilter.score;
	});

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
				$value={modsView$.activeFilter.score}
				onValueChange={(newValues: number[]) => {
					const [newMin, newMax] = newValues;
					if (newMin <= newMax) {
						modsView$.activeFilter.score.set([newMin, newMax]);
					} else {
						modsView$.activeFilter.score.set([newMax, newMax]);
					}
				}}
			/>
			<div className="text-xs text-gray-400">
				{scoreRange[0]}-{scoreRange[1]}
			</div>
		</div>
	);
};

ScoreFilter.displayName = "ScoreFilter";

export default ScoreFilter;
