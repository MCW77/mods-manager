// react
import { useTranslation } from "react-i18next";

// state
import { Memo, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const AssignedFilter = () => {
	const [t] = useTranslation("global-ui");

	return (
		<div className={"w-24 flex flex-col gap-2 items-center"}>
			<Label className="p-r-2" htmlFor={"assigned-filter1"}>
				Assigned
			</Label>
			<div id={"assigned-filter1"} className="flex flex-row gap-2 flex-wrap">
				<Memo>
					{() => {
						const assignedState = use$(
							modsView$.activeFilter.assigned.assigned,
						);
						const value = assignedState || 0;
						const className =
							value === 1
								? "border-inset bg-[#000040]/100"
								: value === -1
									? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500"
									: "text-slate-400";

						return (
							<Button
								className={className}
								size="xs"
								variant={"outline"}
								onClick={() => modsView$.cycleState("assigned", "assigned")}
							>
								{"assigned"}
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
