// state
import { observer, reactive } from "@legendapp/state/react";

// domain
import type { StatWeightsInputProps } from "#/modules/planEditing/components/StatWeightsInputProps";

// components
import { SingleValueSlider } from "#/components/SingleValueSlider/SingleValueSlider";

import { Input } from "#ui/input";
import { Label } from "#ui/label";

const ReactiveInput = reactive(Input);
const ReactiveSlider = reactive(SingleValueSlider);

const BasicInput = observer(({ target$, stat }: StatWeightsInputProps) => {
	return (
		<>
			<Label htmlFor={`${stat}-stat-basic`}>{`${stat}: `}:</Label>
			<ReactiveSlider
				id={`${stat}-stat-basic`}
				min={-100}
				max={100}
				step={1}
				$value={target$.target[stat]}
				onChange={(weight: number) => {
					target$.target[stat].set(weight);
				}}
			/>
			<ReactiveInput
				id={`${stat}-stat-basic2`}
				max={100}
				min={-100}
				step={1}
				type={"number"}
				$value={target$.target[stat]}
				onChange={(e) => {
					target$.target[stat].set(e.target.valueAsNumber);
				}}
			/>
		</>
	);
});

BasicInput.displayName = "BasicInput";

export { BasicInput };
