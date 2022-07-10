// react
import * as React from 'react';
import { connect, ConnectedProps } from "react-redux";

// styles
import './ModImage.css';

// state
import { IAppState } from '../../state/storage';

// domain
import { CharacterNames } from '../../constants/characterSettings';

import { Mod } from '../../domain/Mod';
import { SetStats } from '../../domain/Stats';

// components
import CharacterAvatar from "../CharacterAvatar/CharacterAvatar";
import { Pips } from '../Pips/Pips';


class ModImage extends React.PureComponent<Props> {

  render() {
    const mod = this.props.mod;
    const modColor = this.modColor(mod);
    const extraClass = this.props.className ? ` ${this.props.className}` : '';
    const showAvatar = this.props.showAvatar;
    const character = mod.characterID ? this.props.characters[mod.characterID as CharacterNames] : null;

    return (
      <div className={`mod-image dots-${mod.pips} ${mod.slot} ${SetStats.SetStat.getClassName(mod.set)} ${modColor} ${extraClass}`}>
        <Pips pips={mod.pips}/>
        <div className={'mod-slot-image'} />
        <div className={'mod-level ' + (15 === mod.level ? 'gold ' : 'gray ') + mod.slot}>{mod.level}</div>
        {showAvatar && character &&
          <CharacterAvatar character={character} displayStars={false} displayGear={false} displayLevel={false}/>
        }
      </div>
    );
  }

  modColor(mod: Mod) {
    switch (mod.tier) {
      case 5:
        return 'gold';
      case 4:
        return 'purple';
      case 3:
        return 'blue';
      case 2:
        return 'green';
      default:
        return 'gray';
    }
  }
}

type Props = PropsFromRedux & ComponentProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
type ComponentProps = {
  className?: string,
  mod: Mod,
  showAvatar?: boolean
}

const mapStateToProps = (state: IAppState) => ({
  characters: state.profile.characters
});

const mapDispatchToProps = () => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(ModImage);
