import React from "react";

import "./ModLoadoutView.css";

import type * as ModTypes from "../../domain/types/ModTypes";

import { Character } from "domain/Character";
import { ModLoadout } from "domain/ModLoadout";
import { OptimizationPlan } from "domain/OptimizationPlan";

import ModImage from "../ModImage/ModImage";
import ModStats from "../ModStats/ModStats";




type ComponentProps = {
  modLoadout: ModLoadout;
  showAvatars: boolean;
  assignedCharacter?: Character;
  assignedTarget?: OptimizationPlan;
}
class ModLoadoutView extends React.PureComponent<ComponentProps> {
  render() {
    const set = this.props.modLoadout;
    const showAvatars = 'undefined' !== typeof this.props.showAvatars ? this.props.showAvatars : false;

    const assignedCharacter = this.props.assignedCharacter;
    const assignedTarget = this.props.assignedTarget;

    const modDetails = (Object.keys(set) as ModTypes.GIMOSlots[])
      .filter(slot => null !== set[slot])
      .map(slot =>
      <div className={'mod ' + slot} key={set[slot]!.id}>
        {assignedCharacter && assignedTarget && set[slot]!.shouldLevel(assignedTarget) &&
        <span className={'icon level active'} />
        }
        {assignedCharacter && assignedTarget && set[slot]!.shouldSlice(assignedCharacter, assignedTarget) &&
        <span className={'icon slice active'} />
        }
        <ModImage
          mod={set[slot]!}
          showAvatar={showAvatars}
          className={assignedCharacter && set[slot]!.characterID === assignedCharacter.baseID ? 'no-move' : ''}
        />
        <ModStats mod={set[slot]!} showAvatar assignedCharacter={assignedCharacter}
                  assignedTarget={assignedTarget}/>
      </div>
    );

    return <div className={'mod-set-view'}>
      {modDetails}
    </div>;
  }
}

export default ModLoadoutView;
