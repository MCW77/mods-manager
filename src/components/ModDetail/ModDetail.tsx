import * as React from 'react';
import { connect, ConnectedProps } from "react-redux";

import './ModDetail.css';

import Arrow from '../Arrow/Arrow';
import ModImage from '../ModImage/ModImage';
import ModStats from '../ModStats/ModStats';
import CharacterAvatar from '../CharacterAvatar/CharacterAvatar';
import SellModButton from "../SellModButton/SellModButton";
import { PlayerProfile } from '../../domain/PlayerProfile';
import { BaseCharactersById } from "../../domain/BaseCharacter";
import { Character }  from "../../domain/Character";
import { Mod } from '../../domain/Mod';

class ModDetail extends React.PureComponent<Props> {
  render() {
    const mod = this.props.mod;
    const character: Character | null = mod.characterID !== "null" ?
      this.props.characters[mod.characterID]
    :
      null;
    const assignedCharacter = this.props.assignedCharacter;
    const assignedTarget = this.props.assignedTarget;
    const showAssigned = !!this.props.showAssigned;

    return (
      <div className={'mod-detail'} key={mod.id}>
        <ModImage mod={mod} />
        {character && <CharacterAvatar character={character} />}
        {character &&
          <h4 className={'character-name'}>{
            this.props.baseCharacters[character.baseID] ?
              this.props.baseCharacters[character.baseID].name
            :
              character.baseID
          }</h4>
        }
        <div className="stats">
          <ModStats mod={mod} assignedCharacter={assignedCharacter} assignedTarget={assignedTarget} />
          {showAssigned && assignedCharacter && <div className={'assigned'}>
            <Arrow />
            <CharacterAvatar character={assignedCharacter} />
          </div>}
        </div>
        <SellModButton mod={mod} />
      </div>
    );
  }
}


type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
type ComponentProps = {
  assignedCharacter: any,
  assignedTarget?: any,
  mod: Mod,
  showAssigned?: boolean
}

interface RootState {
  baseCharacters: BaseCharactersById;
  profile: PlayerProfile;
}

const mapStateToProps = (state: RootState) => ({
  characters: state.profile.characters,
  baseCharacters: state.baseCharacters
});

const mapDispatchToProps = () => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ModDetail);
