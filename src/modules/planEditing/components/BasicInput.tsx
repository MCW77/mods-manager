// state
import { reactive, useValue } from "@legendapp/state/react";

// domain
import type { StatWeightsInputProps } from "#/modules/planEditing/components/StatWeightsInputProps";

// components
import { SingleValueSlider } from "#/components/SingleValueSlider/SingleValueSlider";

import { Input } from "#ui/input";
import { Label } from "#ui/label";

const ReactiveInput = reactive(Input);

const BasicInput = ({ target$, stat }: StatWeightsInputProps) => {
	const statValue = useValue(target$.target[stat]);

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
