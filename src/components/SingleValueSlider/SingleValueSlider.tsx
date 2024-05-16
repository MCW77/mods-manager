// react
import type { ComponentPropsWithoutRef } from "react";

// components
import { Slider } from "#ui/slider";
import type { Observable } from "@legendapp/state";
import { reactiveObserver, type ShapeWith$ } from "@legendapp/state/react";

interface SingleValueSliderProps extends ComponentPropsWithoutRef<typeof Slider> {
	singleValue$: Observable<number>;
	onSingleChange: (newValue: number) => void;
}

const SingleValueSlider: React.FC<SingleValueSliderProps> | React.FC<ShapeWith$<SingleValueSliderProps>> = reactiveObserver(({
	singleValue$,
	onSingleChange,
	...props
}: SingleValueSliderProps) => {

	const handleSliderChange = (newValue: number[]) => {
		singleValue$.set(newValue[0]);
		onSingleChange(newValue[0]);
	};

	return (
		<Slider
			{...props}
			value={[singleValue$.get()]}
			onValueChange={handleSliderChange}
		/>
	);
});

SingleValueSlider.displayName = "SingleValueSlider";

export { SingleValueSlider };
