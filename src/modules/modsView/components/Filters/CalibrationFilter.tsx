// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { getFilterSelectionStyles } from "../../domain/FilterSelectionStyles";
import { Mod } from "#/domain/Mod";

// components
const SetAllButtonGroup = lazy(() => import("../SetAllButtonGroup"));
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const CalibrationFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"w-32 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"calibration-filter1"}>
				Calibration
			</Label>
			<div
				id={"calibration-filter1"}
				className="flex flex-row gap-1 justify-center flex-wrap"
			>
				{Mod.reRollPrices.map((calibrationCost) => {
					const inputName = `calibration-filter-${calibrationCost}`;

					return (
						<Memo key={inputName}>
							{() => {
								const calibrationState = use$(() => {
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
											modsView$.cycleState(
												"calibration",
												calibrationCost.toString(),
											)
										}
									>
										{calibrationCost}
									</Button>
								);
							}}
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
