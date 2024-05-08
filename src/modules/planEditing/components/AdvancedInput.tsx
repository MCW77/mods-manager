// state
import { observer, reactive } from "@legendapp/state/react";

// domain
import type { StatWeightsInputProps } from "./StatWeightsInputProps";
import * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { Input } from "#ui/input";
import { Label } from "#ui/label";

const ReactiveInput = reactive(Input);

const AdvancedInput = observer(({ target$, stat }: StatWeightsInputProps) => {
	return (
		<>
			<Label htmlFor={`${stat}-stat-advanced`}>{`${stat}: `}:</Label>
			<ReactiveInput
				id={`${stat}-stat-advanced`}
				max={100 / OptimizationPlan.statWeights[stat]}
				min={-100 / OptimizationPlan.statWeights[stat]}
				step={0.01}
				type={"number"}
				$value={target$.target[stat]}
				onChange={(e) => {
					target$.target[stat].set(e.target.valueAsNumber);
				}}
			/>
		</>
	);
});

AdvancedInput.displayName = "AdvancedInput";

export { AdvancedInput };
