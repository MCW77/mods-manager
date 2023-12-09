// react
import React, { useRef } from 'react';

type ComponentProps = {
  id: string;
  className?: string;
  name: string;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
  isPercent?: boolean;
  editable: boolean;
  onChange?: (value: number) => void;
}

const RangeInput = React.memo(
  ({
    id,
    className,
    name,
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    isPercent = false,
    editable = false,
    onChange = () => {},
  }: ComponentProps) => {
    const slider = useRef<HTMLInputElement>(null);
    const textfield = useRef<HTMLInputElement>(null);
    const output = useRef<HTMLOutputElement>(null);

    if (editable) {
      return (
        <div className={className}>
          <input
            type={'range'}
            id={name && name + '-slider'}
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              if (textfield.current !== null) {
                textfield.current.value = e.target.value;
                onChange(+e.target.value);
              }
            }}
            key={name + 'slider'}
            ref={slider}
          />
          <input
            type={'number'}
            id={id}
            name={name}
            className={"w-12"}
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              if (slider.current !== null) {
                slider.current.value = e.target.value;
                onChange(+e.target.value);
              }
            }}
            key={name + 'input'}
            ref={textfield}
          />
          <span key={'percent'}>{isPercent && '%'}</span>
        </div>
      );
    } else {
      return (
        <div className={className}>
          <input
            type={'range'}
            id={id}
            name={name}
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              if (output.current !== null) {
                output.current.value = e.target.value + (isPercent ? '%' : '');
                onChange(+e.target.value);
              }
            }}
            key={name + 'input'}
          />,
          <output id={name && name + '-display'} htmlFor={id} key={name + 'output'} ref={output}>
            {defaultValue}{isPercent && '%'}
          </output>
        </div>
      );
    }
  }
);

RangeInput.displayName = 'RangeInput';

export { RangeInput };
