// state
import { reactive, use$ } from "@legendapp/state/react";

// domain
import type { StatWeightsInputProps } from "#/modules/planEditing/components/StatWeightsInputProps.js";

// components
import { SingleValueSlider } from "#/components/SingleValueSlider/SingleValueSlider.jsx";

import { Input } from "#ui/input.jsx";
import { Label } from "#ui/label.jsx";

const ReactiveInput = reactive(Input);

const BasicInput = ({ target$, stat }: StatWeightsInputProps) => {
	const statValue = use$(target$.target[stat]);

	return (
		<>
			<Label htmlFor={`${stat}-stat-basic`}>{`${stat}: `}:</Label>
			<SingleValueSlider
				max={100}
				min={-100}
				step={0.5}
				singleValue={statValue}
				onSingleChange={(weight: number) => {
					target$.target[stat].set(weight);
				}}
			/>
			<ReactiveInput
				id={`${stat}-stat-basic`}
				max={100}
				min={-100}
				step={0.5}
				type={"number"}
				$value={target$.target[stat]}
				onChange={(e) => {
					target$.target[stat].set(e.target.valueAsNumber);
				}}
			/>
		</>
	);
};

BasicInput.displayName = "BasicInput";

export { BasicInput };
