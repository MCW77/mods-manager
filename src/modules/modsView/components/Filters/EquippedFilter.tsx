// react
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { getFilterSelectionStyles } from "../../domain/FilterSelectionStyles";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const EquippedFilter = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"equipped-filter1"}>
				{t("filter.EquippedHeadline")}
			</Label>
			<div id={"equipped-filter1"} className="flex flex-row gap-2 flex-wrap">
				<Memo>
					{() => {
						const equippedState = use$(() => {
							const activeFilter = modsView$.activeFilter.get();
							return activeFilter.equipped.equipped;
						});
						const value = equippedState || 0;
						const className = getFilterSelectionStyles(value);

						return (
							<Button
								className={className}
								size="xs"
								variant={"outline"}
								onClick={() => modsView$.cycleState("equipped", "equipped")}
							>
								{t("filter.EquippedValue")}
							</Button>
						);
					}}
				</Memo>
			</div>
		</div>
	);
};

EquippedFilter.displayName = "EquippedFilter";

export default EquippedFilter;
