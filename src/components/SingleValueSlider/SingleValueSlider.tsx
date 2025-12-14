// react
import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { reactiveObserver, type ShapeWith$ } from "@legendapp/state/react";

// components
import { Slider } from "#ui/slider";

interface SingleValueSliderProps
	extends ComponentPropsWithoutRef<typeof Slider> {
	singleValue: number;
	onSingleChange: (newValue: number) => void;
}

const SingleValueSlider:
	| React.FC<SingleValueSliderProps>
	| React.FC<ShapeWith$<SingleValueSliderProps>> = reactiveObserver(
	({ singleValue, onSingleChange, ...props }: SingleValueSliderProps) => {
		const [sliderValue, setSliderValue] = useState<number>(singleValue);

		useEffect(() => {
			setSliderValue(singleValue);
		}, [singleValue]);

		const handleSliderChange = (newValue: number[]) => {
			setSliderValue(newValue[0]);
			singleValue = newValue[0];
			onSingleChange(newValue[0]);
		};

		return (
			<Slider
				{...props}
				value={[sliderValue]}
				onValueChange={handleSliderChange}
			/>
		);
	},
);

SingleValueSlider.displayName = "SingleValueSlider";

export { SingleValueSlider };
