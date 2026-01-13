// utils
import { numberAsNumberArray } from "#/utils/legend-kit/as/numberAsNumberArray";

// react
import type { ComponentProps } from "react";
import { useObservable, useValue } from "@legendapp/state/react";

// state
import type { Observable, ObservableParam } from "@legendapp/state";

// components
import { Slider as ShadCNSlider } from "#ui/slider";

type ShadCNSliderProps = ComponentProps<typeof ShadCNSlider>;
interface SliderProps
	extends Omit<ShadCNSliderProps, "value" | "onValueChange"> {
	$value: ObservableParam<number[]> | ObservableParam<number>;
	$min?: ObservableParam<number>;
	$max?: ObservableParam<number>;
	onValueChange?: (newValue: number[]) => void;
}

function Slider({
	$value,
	$min,
	$max,
	max,
	min,
	onValueChange,
	...props
}: SliderProps) {
	const value$: Observable<number[]> = useObservable<number[]>(
		Array.isArray($value.get())
			? ($value as ObservableParam<number[]>)
			: numberAsNumberArray($value as ObservableParam<number>),
	);
	const value = useValue(value$);
	const derivedMin = useValue(() => ($min ? $min.get() : (min ?? 0)));
	const derivedMax = useValue(() => ($max ? $max.get() : (max ?? 100)));

	const handleValueChange = (newValue: number[]) => {
		if (!Array.isArray($value.peek())) {
			$value.set(newValue[0]);
		} else {
			$value.set(newValue);
		}
		onValueChange?.(newValue);
	};
	return (
		<ShadCNSlider
			{...props}
			value={value}
			min={derivedMin}
			max={derivedMax}
			onValueChange={handleValueChange}
		/>
	);
}

export { Slider };
