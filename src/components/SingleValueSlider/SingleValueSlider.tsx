// react
import React, { useState } from 'react';

// components
import { Slider } from '#ui/slider';

interface SingleValueSliderProps {
  className?: string;
  id?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (newValue: number) => void;
}

const SingleValueSlider = ({
  className = '',
  id = '',
  min,
  max,
  step,
  value,
  onChange,
}: SingleValueSliderProps) => {
  const [sliderValue, setSliderValue] = useState<number>(value);

  const handleSliderChange = (newValue: number[]) => {
    setSliderValue(newValue[0]);
    value = newValue[0];
    onChange(newValue[0]);
  };

  return (
    <Slider
      className={className}
      id={id}
      min={min}
      max={max}
      step={step}
      value={[sliderValue]}
      onValueChange={handleSliderChange}
    />
  );
};

export { SingleValueSlider };
