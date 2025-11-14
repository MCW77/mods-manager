// react
import { Switch, reactive, reactiveObserver } from "@legendapp/state/react";

// state
import { beginBatch, endBatch } from "@legendapp/state";
import { target$ } from "#/modules/planEditing/state/planEditing.js";

// domain
import * as OptimizationPlan from "#/domain/OptimizationPlan.js";

// components
import { AdvancedInput } from "./AdvancedInput.jsx";
import { BasicInput } from "./BasicInput.jsx";
import { StatWeightsForm } from "./StatWeightsForm.jsx";

import { Button } from "#ui/button.jsx";
import { Label } from "#ui/label.jsx";
import { Switch as ShadSwitch } from "#ui/switch.jsx";

const ReactiveSwitch = reactive(ShadSwitch);

export const StatWeightsWidget: React.FC = reactiveObserver(() => {
	return (
		<div className={""}>
			<div>
				<Label className="p-r-2" htmlFor={"basic-advanced-switch"}>
					Basic
				</Label>
				<ReactiveSwitch
					$checked={target$.isInAdvancedEditMode}
					onCheckedChange={(checked) => {
						beginBatch();
						target$.isInAdvancedEditMode.set(checked);
						checked
							? target$.target.set(
									OptimizationPlan.normalize(target$.target.peek()),
								)
							: target$.target.set(
									OptimizationPlan.denormalize(target$.target.peek()),
								);
						endBatch();
					}}
					id={"basic-advanced-switch"}
				/>
				<Label className="p-l-2" htmlFor={"basic-advanced-switch"}>
					Advanced
				</Label>
			</div>
			<div className="flex flex-col flex-gap-4 justify-center p-2">
				<Switch value={target$.isInAdvancedEditMode}>
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
