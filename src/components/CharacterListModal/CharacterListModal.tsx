import React, { createRef } from "react";
import { connect, ConnectedProps } from "react-redux";

import { IAppState } from 'state/storage';
import { ThunkDispatch } from 'state/reducers/modsOptimizer';

import { hideModal, showError, showModal } from "../../state/actions/app";
import { CharacterListGenerationParameters, fetchCharacterList, UseCaseModes } from "../../state/actions/data";

import { Dropdown } from "../../components/Dropdown/Dropdown";
import Spoiler from "../../components/Spoiler/Spoiler";
import Toggle from "../../components/Toggle/Toggle";

type ToggleType = typeof Toggle;
type tt = HTMLFormElement;
class CharacterListModal extends React.PureComponent<Props> {
    form: React.RefObject<HTMLFormElement>;
    //overwriteToggle: React.RefObject<ToggleType>;

    constructor(props: Props) {
      super(props);

      this.form = createRef<HTMLFormElement>();
//      this.overwriteToggle = createRef<ToggleType>();
    }
    render() {
      return <div>
      <h3 className={'gold'}>Auto-generate Character List</h3>
      <p>
        This utility will auto-generate a character list for you based on your current roster and selected use case.
        This is intended to be an easy starting point, and is by no means the final say in how your characters should be
        ordered or what targets should be chosen.
      </p>
      <p>
        <span className={'purple'}>Note:</span> unless you specify otherwise in "Advanced Settings" below, your current
        arena team will always be placed at the top of the list.
      </p>
      <p><span className={'blue'}>Provided by&nbsp;
        <a href={'https://swgoh.spineless.net/'} target={'_blank'} rel={'noopener noreferrer'}>
          https://swgoh.spineless.net/
        </a>
      </span></p>
      <hr />
      <form ref={this.form}>
        <label htmlFor={'use-case'}>Select your use case:</label>
        <Dropdown name={'use-case'} defaultValue={''} onChange={() => {}}>
          <option value={''}>Grand Arena / Territory Wars</option>
          <option value={1}>Light-side Territory Battle</option>
          <option value={2}>Dark-side Territory Battle</option>
          <option value={3}>Arena only</option>
        </Dropdown>
        <Toggle
          id={'overwrite'}
          className={''}
          name={'overwrite'}
//          ref={toggle => overwrite = toggle}
          inputLabel={'Overwrite existing list?'}
          leftValue={'false'}
          leftLabel={'Append'}
          rightValue={'true'}
          rightLabel={'Overwrite'}
          value={'true'}
          disabled={false}
          onChange={() => {}}
        />
        <Spoiler title={'Advanced Settings'}>
          <div className={'form-row'}>
            <label htmlFor={'alignment-filter'}>Alignment:</label>
            <Dropdown
               name={'alignment-filter'}
               defaultValue={0}
               onChange={() =>{}}
            >
              <option value={0}>All Characters</option>
              <option value={1}>Light Side Only</option>
              <option value={2}>Dark Side Only</option>
            </Dropdown>
          </div>
          <div className={'form-row'}>
            <label htmlFor={'minimum-gear-level'}>Minimum Gear Level:</label>
            <Dropdown
              name={'minimum-gear-level'}
              defaultValue={1}
              onChange={() => {}}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
              <option value={6}>6</option>
              <option value={7}>7</option>
              <option value={8}>8</option>
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
              <option value={13}>13</option>
            </Dropdown>
          </div>
          <div className={'form-row'}>
            <label htmlFor={'ignore-arena'}>Ignore arena teams:</label>
            <input name={'ignore-arena'} type={'checkbox'} defaultChecked={false} />
          </div>
          <div className={'form-row'}>
            <label htmlFor={'max-list-size'}>Maximum list size:&nbsp;</label>
            <input name={'max-list-size'} type={'text'} inputMode={'numeric'} size={3} />
          </div>
        </Spoiler>        
      </form>
      <hr />
      <div className={'actions'}>
        <button type={'button'} onClick={() => this.props.hideModal()}>Cancel</button>
        <button
          type={'button'}
          onClick={() => {
            if (this.form.current === null) return;
            const formElements = this.form.current.elements;
            const inputValue = (name: string)=> (formElements.namedItem(name) as HTMLInputElement).value
            
            const parameters: CharacterListGenerationParameters = {
              'alignmentFilter': Number(inputValue('alignment-filter')),
              'minimumGearLevel': Number(inputValue('minimum-gear-level')),
              'ignoreArena': true,
              'top': Number(inputValue('max-list-size')),
            }

            this.props.generateCharacterList(
              this.form.current!['use-case'].value,
              this.form.current!['overwrite'].value,
              this.props.allyCode,
              parameters
            )
          }}
        >
          Generate
        </button>
      </div>
    </div>;

    }
};


type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;

type ComponentProps = {
}

const mapStateToProps = (state: IAppState) => {
  return {
    allyCode: state.allyCode,
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  hideModal: () => dispatch(hideModal()),
  generateCharacterList: (
    mode: UseCaseModes,
    behavior: boolean,
    allyCode: string,
    parameters: CharacterListGenerationParameters
  ) => {
    dispatch(fetchCharacterList(mode, behavior, allyCode, parameters));
    dispatch(hideModal());
  },
})

let connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(CharacterListModal);