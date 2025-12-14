// react
import type { ComponentType } from "react";

// state
import { observer } from "@legendapp/state/react";

// domain
import type { PlanEditing } from "../domain/PlanEditing";
import type { StatWeightsInputProps } from "./StatWeightsInputProps";

type ComponentProps = {
	target$: PlanEditing;
	StatInput: ComponentType<StatWeightsInputProps>;
};

const StatWeightsForm: React.FC<ComponentProps> = observer(
	({ target$, StatInput }: ComponentProps) => {
		return (
			<div className="flex flex-wrap gap-4">
				<div>
					<StatInput target$={target$} stat={"Health"} />
					<StatInput target$={target$} stat={"Protection"} />
					<StatInput target$={target$} stat={"Tenacity %"} />
					<StatInput target$={target$} stat={"Armor"} />
					<StatInput target$={target$} stat={"Resistance"} />
					<StatInput target$={target$} stat={"Critical Avoidance %"} />
				</div>
				<div>
					<StatInput target$={target$} stat={"Speed"} />
					<StatInput target$={target$} stat={"Critical Chance"} />
					<StatInput target$={target$} stat={"Critical Damage %"} />
					<StatInput target$={target$} stat={"Potency %"} />
					<StatInput target$={target$} stat={"Physical Damage"} />
					<StatInput target$={target$} stat={"Special Damage"} />
					<StatInput target$={target$} stat={"Accuracy %"} />
				</div>
			</div>
		);
	},
);

StatWeightsForm.displayName = "StatWeightsForm";

export { StatWeightsForm };
