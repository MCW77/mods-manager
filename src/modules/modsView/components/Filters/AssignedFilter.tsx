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

const AssignedFilter = () => {
	const [t] = useTranslation("explore-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"assigned-filter1"}>
				{t("filter.AssignedHeadline")}
			</Label>
			<div id={"assigned-filter1"} className="flex flex-row gap-2 flex-wrap">
				<Memo>
					{() => {
						const assignedState = use$(() => {
							const activeFilter = modsView$.activeFilter.get();
							return activeFilter.assigned.assigned;
						});
						const value = assignedState || 0;
						const className = getFilterSelectionStyles(value);

						return (
							<Button
								className={className}
								size="xs"
								variant={"outline"}
								onClick={() => modsView$.cycleState("assigned", "assigned")}
							>
								{t("filter.AssignedValue")}
							</Button>
						);
					}}
				</Memo>
			</div>
		</div>
	);
};

AssignedFilter.displayName = "AssignedFilter";

export default AssignedFilter;
