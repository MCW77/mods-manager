// react
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// styles
import "./Toggle.css";

//utils
import { ExpandRecursively, ExpandRecursivelyNoFuncs } from "../../utils/typeHelper";

// state
import { IAppState } from 'state/storage';


class Toggle extends React.Component<ComponentProps, ComponentState> {
  checkbox: React.RefObject<HTMLInputElement>;
  toggleSwitch: React.RefObject<HTMLSpanElement>;
  value: string;

  constructor(props: ComponentProps) {
    super(props);

    if ('undefined' === typeof this.props.leftValue || 'undefined' === typeof this.props.rightValue) {
      throw new Error('Both a left and right value must be specified for the toggle');
    }

    if (this.props.value && ![this.props.leftValue, this.props.rightValue].includes(this.props.value)) {
      throw new Error('The value specified for the toggle must be one of the left or right values');
    }

    this.checkbox = React.createRef<HTMLInputElement>();
    this.toggleSwitch = React.createRef<HTMLSpanElement>();

    this.value = this.props.value || this.props.rightValue;
    this.state = { disabled: this.props.disabled ?? false };
  }

  updateValue(newValue: string) {
    if (![this.props.leftValue, this.props.rightValue].includes(newValue)) {
      throw new Error('The value specified for the toggle must be one of the left or right values');
    }

    this.value = newValue;

    if (newValue === this.props.rightValue) {
      if (this.checkbox.current !== null)
        this.checkbox.current.checked = true;
      if (this.toggleSwitch.current !== null) {
        this.toggleSwitch.current.classList.remove('left');
        this.toggleSwitch.current.classList.add('right');
      }
    } else {
      if (this.checkbox.current !== null)
        this.checkbox.current.checked = false;
      if (this.toggleSwitch.current !== null) {  
        this.toggleSwitch.current.classList.remove('right');
        this.toggleSwitch.current.classList.add('left');
      }
    }
  }

  disable() {
    this.setState({ disabled: true });
  }

  enable() {
    this.setState({ disabled: false });    
  }

  /**
   * Process the onChange event for the hidden input that actually switches the toggle value.
   * If there is an onChange handler for the toggle as a whole, pass the value to it
   */
  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;

    if (input.checked) {
      this.value = this.props.rightValue;
      if (this.toggleSwitch.current !== null) {
        this.toggleSwitch.current.classList.remove('left');
        this.toggleSwitch.current.classList.add('right');
      }
    } else {
      this.value = this.props.leftValue;
      if (this.toggleSwitch.current !== null) {
        this.toggleSwitch.current.classList.remove('right');
        this.toggleSwitch.current.classList.add('left');
      }  
    }

    if (this.props.onChange) {
      this.props.onChange(this.value);
    }
  }

  render() {
    const className = `toggle-wrapper ${this.props.className} ${this.state.disabled ? 'disabled' : ''}`;

    return <div className={className}>
      <div className={'toggle-label'}>{this.props.inputLabel}</div>
      <label>
        <input type={'checkbox'}
          className={'toggle'}
          ref={this.checkbox}          
          name={this.props.name ?? ''}
          id={this.props.id}
          value={this.props.rightValue}
          defaultChecked={this.value === this.props.rightValue}
          onChange={this.onChange.bind(this)}
          disabled={this.state.disabled}
        />
        <span className={'toggle-left-value'}>{this.props.leftLabel}</span>
        <span
          className={'toggle-switch ' + (this.value === this.props.leftValue ? 'left' : 'right')}
          ref={this.toggleSwitch} />
        <span className={'toggle-right-value'}>{this.props.rightLabel}</span>
      </label>
    </div>;
  }
}

interface ComponentState {
  disabled: boolean;
}

type ComponentProps = {
  name?: string;
  id?: string;
  className?: string;
  inputLabel: string;
  leftLabel: string;
  rightLabel: string;
  leftValue: string;
  rightValue: string;
  value: string;
  disabled?: boolean;
  onChange?: (newValue: string) => void;
}

/*
const mapStateToProps = (state: IAppState) => {
  return {}
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
})

let connector = connect(mapStateToProps, mapDispatchToProps);
*/

export { Toggle };
