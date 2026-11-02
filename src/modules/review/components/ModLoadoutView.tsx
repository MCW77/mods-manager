// react
import * as React from "react";

// domain
import * as ModLoadout from "#/domain/ModLoadout";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";

// components
import ModDetail from "#/components/ModDetail/ModDetail";
import { ScrollArea, ScrollBar } from "#ui/scroll-area";

type ComponentProps = {
	modLoadout: ModLoadout.ModLoadout;
	assignedTarget?: OptimizationPlan;
};

const ModLoadoutView = React.memo(
	({ modLoadout, assignedTarget }: ComponentProps) => {
		const usedSlots = ModLoadout.getUsedSlots(modLoadout);
		let modDetails = null;
		if (ModLoadout.hasSlots(modLoadout, usedSlots)) {
			modDetails = usedSlots.map((slot) => (
				<div className={"flex"} key={modLoadout[slot]?.id}>
					<ModDetail mod={modLoadout[slot]} assignedTarget={assignedTarget} />
				</div>
			));
		}
		return (
			<ScrollArea>
				<div className={"relative grid grid-flow-col grid-rows-3 gap-2"}>
					{modDetails}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		);
	},
);

ModLoadoutView.displayName = "ModLoadoutView";

export default ModLoadoutView;
