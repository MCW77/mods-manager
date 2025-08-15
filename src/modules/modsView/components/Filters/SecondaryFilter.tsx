// react
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import {
	type SecondarySettingsSecondaries,
	secondarySettingsSecondaries,
} from "../../domain/ModsViewOptions";

// components
import { Label } from "#ui/label";
import { Slider } from "#ui/slider";

const SecondaryFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"p-x-1 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"secondary-filter1"}>
				Secondary Stat Rolls
			</Label>
			<div id={"secondary-filter1"} className="flex flex-row gap-4 flex-wrap">
				{secondarySettingsSecondaries.map(
					(secondary: SecondarySettingsSecondaries) => {
						const inputName = `secondary-filter-${secondary}`;

						return (
							<Memo key={inputName}>
								{() => {
									const secondaryRange = use$(() => {
										const activeFilter = modsView$.activeFilter.get();
										return activeFilter.secondary[secondary];
									});
									const value = secondaryRange || [0, 5];

									return (
										<div className="flex flex-col gap-1 items-center">
											<Label
												className="text-xs text-[modgold]"
												htmlFor={inputName}
											>
												{secondary}
											</Label>
											<Slider
												className="w-16"
												id={inputName}
												max={5}
												min={0}
												step={1}
												value={value}
												onValueChange={(newValues: [number, number]) => {
													const [newMin, newMax] = newValues;
													if (newMin <= newMax) {
														modsView$.activeFilter.secondary[secondary].set(
															newValues,
														);
													} else {
														modsView$.activeFilter.secondary[secondary].set([
															newMax,
															newMax,
														]);
													}
												}}
											/>
											<div className="text-xs text-gray-400">
												{value[0]}-{value[1]}
											</div>
										</div>
									);
								}}
							</Memo>
						);
					},
				)}
			</div>
		</div>
	);
};

SecondaryFilter.displayName = "SecondaryFilter";

export default SecondaryFilter;
