// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// domain
import type { AssignedSettings } from "../../domain/ModsViewOptions";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const AssignedFilter = observer(
	React.memo(() => {
		const [t] = useTranslation("global-ui");
		const assignedConfig: AssignedSettings =
			modsView$.activeFilter.assigned.get();
		const value = assignedConfig.assigned || 0;
		const className =
			value === 1
				? "border-inset bg-[#000040]/100"
				: value === -1
					? "border-inset bg-[#400000]/100 border-[#800000]/100 text-red-500"
					: "text-slate-400";

		return (
			<div className={"w-24 flex flex-col gap-2 items-center"}>
				<Label className="p-r-2" htmlFor={"assigned-filter1"}>
					Assigned
				</Label>
				<div id={"assigned-filter1"} className="flex flex-row gap-2 flex-wrap">
					<Button
						className={className}
						key={"assigned-filter-assigned"}
						size="xs"
						variant={"outline"}
						onClick={() => modsView$.cycleState("assigned", "assigned")}
					>
						{"assigned"}
					</Button>
				</div>
			</div>
		);
	}),
);

AssignedFilter.displayName = "AssignedFilter";

export { AssignedFilter };
