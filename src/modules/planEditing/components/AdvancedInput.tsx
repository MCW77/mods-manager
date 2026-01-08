// state
import { observer } from "@legendapp/state/react";

// domain
import type { StatWeightsInputProps } from "./StatWeightsInputProps";
import * as OptimizationPlan from "#/domain/OptimizationPlan";

// components
import { Input } from "#/components/reactive/Input";
import { Label } from "#ui/label";

const AdvancedInput: React.FC<StatWeightsInputProps> = observer(
	({ target$, stat }: StatWeightsInputProps) => {
		return (
			<>
				<Label htmlFor={`${stat}-stat-advanced`}>{`${stat}: `}:</Label>
				<Input
					id={`${stat}-stat-advanced`}
					max={100 / OptimizationPlan.statWeights[stat]}
					min={-100 / OptimizationPlan.statWeights[stat]}
					step={0.01}
					type={"number"}
					$value={target$.target[stat]}
				/>
			</>
		);
	},
);

AdvancedInput.displayName = "AdvancedInput";

export { AdvancedInput };
