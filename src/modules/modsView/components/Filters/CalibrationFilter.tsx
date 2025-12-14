// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { getFilterSelectionStyles } from "../../domain/FilterSelectionStyles";
import { Mod } from "#/domain/Mod";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

function CalibrationButton({ calibrationCost }: { calibrationCost: number }) {
	const calibrationState = useValue(() => {
		const activeFilter = modsView$.activeFilter.get();
		return activeFilter.calibration[String(calibrationCost)];
	});
	const value = calibrationState || 0;
	const className = getFilterSelectionStyles(value);

	return (
		<Button
			className={className}
			size="xs"
			variant={"outline"}
			onClick={() =>
				modsView$.cycleState("calibration", calibrationCost.toString())
			}
		>
			{calibrationCost}
		</Button>
	);
}

const CalibrationFilter = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"w-32 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"calibration-filter1"}>
				{t("filter.CalibrationHeadline")}
			</Label>
			<div
				id={"calibration-filter1"}
				className="flex flex-row gap-1 justify-center flex-wrap"
			>
				{Mod.reRollPrices.map((calibrationCost) => {
					const inputName = `calibration-filter-${calibrationCost}`;

					return (
						<Memo key={inputName}>
							{() => <CalibrationButton calibrationCost={calibrationCost} />}
						</Memo>
					);
				})}
			</div>
			<SetAllButtonGroup filterKey="calibration" />
		</div>
	);
};

CalibrationFilter.displayName = "CalibrationFilter";

export default CalibrationFilter;
