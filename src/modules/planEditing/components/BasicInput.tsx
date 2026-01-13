// domain
import type { StatWeightsInputProps } from "#/modules/planEditing/components/StatWeightsInputProps";

// components
import { Input } from "#/components/reactive/Input";
import { Slider } from "#/components/reactive/Slider";
import { Label } from "#ui/label";

const BasicInput = ({ target$, stat }: StatWeightsInputProps) => {
	return (
		<div>
			<Label htmlFor={`${stat}-stat-basic`}>{`${stat}: `}:</Label>
			<Slider max={100} min={-100} step={0.5} $value={target$.target[stat]} />
			<Input
				id={`${stat}-stat-basic`}
				max={100}
				min={-100}
				step={0.5}
				type={"number"}
				$value={target$.target[stat]}
			/>
		</div>
	);
};

BasicInput.displayName = "BasicInput";

export { BasicInput };
