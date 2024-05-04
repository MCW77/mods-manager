// react
import { useRef } from "react";
import {
	Switch,
	observer,
	reactive,
	useObservable,
} from "@legendapp/state/react";

// domain
import * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { PlanEditing } from "#/modules/planEditing/domain/PlanEditing";

// components
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { Switch as ShadSwitch } from "#ui/switch";
import { BasicInput } from "./BasicInput";
import { AdvancedInput } from "./AdvancedInput";
import { StatWeightsForm } from "./StatWeightsForm";

const ReactiveSwitch = reactive(ShadSwitch);

type ComponentProps = {
	target$: PlanEditing;
};

export const StatWeightsWidget = observer(({ target$ }: ComponentProps) => {
	const isInAdvancedEditMode = useRef(false);
	const isInAdvancedEditMode$ = useObservable(isInAdvancedEditMode.current);
	isInAdvancedEditMode$.onChange((value) => {
		value.value
			? target$.target.set(OptimizationPlan.normalize(target$.target.peek()))
			: target$.target.set(OptimizationPlan.denormalize(target$.target.peek()));
	});

	return (
		<div className={""}>
			<div>
				<Label className="p-r-2" htmlFor={"basic-advanced-switch"}>
					Basic
				</Label>
				<ReactiveSwitch
					$checked={isInAdvancedEditMode$}
					onCheckedChange={(checked) => {
						isInAdvancedEditMode$.set(checked);
					}}
					id={"basic-advanced-switch"}
				/>
				<Label className="p-l-2" htmlFor={"basic-advanced-switch"}>
					Advanced
				</Label>
			</div>
			<div className="flex flex-col flex-gap-4 justify-center p-2">
				<Switch value={isInAdvancedEditMode$}>
					{{
						false: () => (
							<StatWeightsForm target$={target$} StatInput={BasicInput} />
						),
						true: () => (
							<StatWeightsForm target$={target$} StatInput={AdvancedInput} />
						),
					}}
				</Switch>
				<Button type={"button"} onClick={() => target$.zeroAll()}>
					Zero all weights
				</Button>
			</div>
		</div>
	);
});

StatWeightsWidget.displayName = "StatWeightsWidget";
