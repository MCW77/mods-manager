import React from 'react';
import { connect, ConnectedProps } from "react-redux";

import './RangeInput.css';

import { IAppState } from 'state/storage';
import { ThunkDispatch } from 'state/reducers/modsOptimizer';

class RangeInput extends React.PureComponent<Props> {
  render() {
    const id = this.props.id;
    const name = this.props.name;
    const defaultValue = this.props.defaultValue;
    const min = this.props.min || 0;
    const max = this.props.max || 100;
    const step = 'undefined' === typeof this.props.step ? 1 : this.props.step;
    const isPercent = this.props.isPercent || false;
    const editable = this.props.editable || false;
    const onChange = this.props.onChange || function () { };

    let slider: HTMLInputElement | null, textField: HTMLInputElement | null, output: HTMLOutputElement;

    if (editable) {
      return [
        <input
          type={'range'}
          id={name && name + '-slider'}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            textField.value = +e.target.value;
            onChange(+e.target.value);
          }}
          key={name + 'slider'}
          ref={input => slider = input}
        />,
        <input
          type={'number'}
          id={id}
          name={name}
          className={'slider-input'}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            slider.value = e.target.value;
            onChange(+e.target.value);
          }}
          key={name + 'input'}
          ref={input => textField = input}
        />,
        <span key={'percent'}>{isPercent && '%'}</span>
      ];
    } else {
      return [
        <input
          type={'range'}
          id={id}
          name={name}
          defaultValue={defaultValue}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            output.value = e.target.value + (isPercent ? '%' : '');
            onChange(+e.target.value);
          }}
          key={name + 'input'}
        />,
        <output id={name && name + '-display'} htmlFor={id} key={name + 'output'} ref={element => output = element as HTMLOutputElement}>
          {defaultValue}{isPercent && '%'}
        </output>
      ];
    }
  }
}

type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
type onChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;

type ComponentProps = {
  id: string;
  name: string;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
  isPercent?: boolean;
  editable: boolean;
  onChange?: (value: number) => void;
}


const mapStateToProps = (state: IAppState) => {
  return {}
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
})

let connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(RangeInput);
