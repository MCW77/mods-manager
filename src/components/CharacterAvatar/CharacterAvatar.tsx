// react
import * as React from 'react';
import { useSelector } from "react-redux";

// styles
import './CharacterAvatar.css';

// modules
import { Data } from '../../state/modules/data';

// domain
import { BaseCharacter, defaultBaseCharacter } from "../../domain/BaseCharacter";
import { Character } from "../../domain/Character";


type ComponentProps = {
  character?: Character,
  displayGear?: boolean,
  displayLevel?: boolean,
  displayStars?: boolean,
  id?: string
}

const CharacterAvatar = React.memo(({
  character,
  displayGear = true,
  displayLevel = true,
  displayStars = true,
  id,
}: ComponentProps) => {
    const baseCharacters = useSelector(Data.selectors.selectBaseCharacters);

    if (character === undefined || character === null) return null;

    const baseCharacter: BaseCharacter = baseCharacters[character.baseID] ?? {...defaultBaseCharacter, baseID: character.baseID, name: character.baseID};
    const className = `avatar gear-${displayGear ?
      character.playerValues.gearLevel :
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
          loading={"lazy"}
          alt={baseCharacter.name}
          title={baseCharacter.name}
          draggable={false} />
        {displayLevel && <div className={'character-level'}>{character.playerValues.level}</div>}
      </div>
    )
  }
);

CharacterAvatar.displayName = 'CharacterAvatar';

export { CharacterAvatar };
