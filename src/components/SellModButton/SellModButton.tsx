// react
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ThunkDispatch } from '../../state/reducers/modsOptimizer';

// state
import { IAppState } from '../../state/storage';

// actions
import {
  hideModal,
  showModal,
} from '../../state/actions/app';

// thunks
import {
  deleteMod,
} from '../../state/thunks/storage';

// domain
import { Mod } from '../../domain/Mod';

// components
import type * as UITypes from "../../components/types";

import { CharacterAvatar } from '../CharacterAvatar/CharacterAvatar';
import { ModImage } from '../ModImage/ModImage';
import { ModStats } from '../ModStats/ModStats';


class SellModButton extends React.PureComponent<Props> {
  render() {
    return <button className={'delete-button red small'} onClick={() => this.props.showModal(this.deleteModal())}>
      X
    </button>;
  }

  /**
   * Render a modal that asks if the user is sure that they want to delete the mod
   */
  deleteModal() {
    const mod = this.props.mod;
    const character = mod.characterID !== 'null' ? this.props.characters[mod.characterID] : null;

    return <div>
      <h2>Delete Mod</h2>
      <div className={'delete-mod-display'}>
        <ModImage mod={mod} />
        {character && <CharacterAvatar character={character} />}
        {character &&
          <h4 className={'character-name'}>{
            this.props.baseCharacters[character.baseID] ? this.props.baseCharacters[character.baseID].name : character.baseID
          }</h4>
        }
        <ModStats mod={mod}/>
      </div>
      <p>Are you sure you want to delete this mod from the mods optimizer?</p>
      <div className={'actions'}>
        <button type={'button'} onClick={() => { this.props.hideModal() }}>No</button>
        <button type={'button'} onClick={() => { this.props.deleteMod(mod) }} className={'red'}>
          Yes, Delete Mod
        </button>
      </div>
    </div>;
  }
}

const mapStateToProps = (state: IAppState) => ({
  characters: state.profile.characters,
  baseCharacters: state.baseCharacters
});

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  showModal: (content: UITypes.DOMContent) => dispatch(showModal('', content)),
  hideModal: () => dispatch(hideModal()),
  deleteMod: (mod: Mod) => { dispatch(deleteMod(mod)); dispatch(hideModal()) }
});

type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;

type ComponentProps = {
  mod: Mod,
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(SellModButton);
