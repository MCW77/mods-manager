import * as React from 'react';
import { connect, ConnectedProps } from "react-redux";

import './CharacterAvatar.css';

import { BaseCharacter, BaseCharactersById, defaultBaseCharacter } from "../../domain/BaseCharacter";
import { Character } from "../../domain/Character";

class CharacterAvatar extends React.PureComponent<Props> {
  render(): React.ReactNode {
    const character: Character | undefined = this.props.character;

    if (!character) {
      return null;
    }

    const baseCharacter: BaseCharacter = this.props.baseCharacters[character.baseID] ?? {...defaultBaseCharacter, baseID: character.baseID, name: character.baseID};

    const displayStars = this.props.displayStars ?? true;
    const displayGear = this.props.displayGear ?? true;
    const displayLevel = this.props.displayLevel ?? true;
    const id = this.props.id ?? undefined; 
    const className = `avatar gear-${displayGear ?
      character!.playerValues.gearLevel :
      0} star-${character!.playerValues.stars} align-${baseCharacter.alignment}`;

    const star: (position: number) => React.ReactNode = position => {
      const isActive = position <= character!.playerValues.stars;
      const baseClass = isActive ? 'active star' : 'star';
      return <div className={`${baseClass} star-${position}`} key={`star-${position}`} />;
    };

    return (

      <div
        className={className}
        id={id}>
        {displayStars && [1, 2, 3, 4, 5, 6, 7].map(star)}
        <img
          src={baseCharacter.avatarUrl}
          alt={baseCharacter.name}
          title={baseCharacter.name}
          draggable={false} />
        {displayLevel && <div className={'character-level'}>{character!.playerValues.level || '??'}</div>}
      </div>
    );
  }

  static imageName(name: string) {
    return name ? name.trim().toLowerCase().replace(/\s/g, '_').replace(/["']/g, '') : '';
  }
}

type Props = PropsFromRedux & OwnProps;
type PropsFromRedux = ConnectedProps<typeof connector>;
type OwnProps = {
  character?: Character,
  displayGear?: boolean,
  displayLevel?: boolean,
  displayStars?: boolean,
  id?: string
}
interface RootState {
  baseCharacters: BaseCharactersById;
}
const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  baseCharacters: state.baseCharacters
});

const mapDispatchToProps = () => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);

export default connector(CharacterAvatar);
