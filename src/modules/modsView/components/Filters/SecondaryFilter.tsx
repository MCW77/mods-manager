// react
import { lazy } from "react";
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
const SetAllButtonGroup = lazy(
	() => import("#/modules/modsView/components/SetAllButtonGroup"),
);
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { getFilterSelectionStyles } from "../../domain/FilterSelectionStyles";

const SecondaryFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"p-x-1 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"secondary-filter1"}>
				Secondary Stat
			</Label>
			<div id={"secondary-filter1"} className="flex flex-row gap-2 flex-wrap">
				{secondarySettingsSecondaries.map(
					(secondary: SecondarySettingsSecondaries) => {
						const inputName = `secondary-filter-${secondary}`;

						return (
							<Memo key={inputName}>
								{() => {
									const secondaryState = use$(() => {
										const activeFilter = modsView$.activeFilter.get();
										return activeFilter.secondary[secondary];
									});
									const value = secondaryState || 0;
									const className = getFilterSelectionStyles(value);

									return (
										<Button
											className={className}
											size="xs"
											variant={"outline"}
											onClick={() =>
												modsView$.cycleState("secondary", secondary.toString())
											}
										>
											{secondary}
										</Button>
									);
								}}
							</Memo>
						);
					},
				)}
			</div>
			<SetAllButtonGroup filterKey="secondary" />
		</div>
	);
};

SecondaryFilter.displayName = "SecondaryFilter";

export default SecondaryFilter;
