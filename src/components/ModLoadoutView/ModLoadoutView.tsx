// react
import React from "react";

// styles
import "./ModLoadoutView.css";

// domain
import type * as ModTypes from "../../domain/types/ModTypes";

import { Character } from "../../domain/Character";
import { ModLoadout } from "../../domain/ModLoadout";
import { OptimizationPlan } from "../../domain/OptimizationPlan";

// components
import { ModImage } from "../ModImage/ModImage";
import { ModStats } from "../ModStats/ModStats";

type ComponentProps = {
  modLoadout: ModLoadout;
  showAvatars: boolean;
  assignedCharacter?: Character;
  assignedTarget?: OptimizationPlan;
};

const ModLoadoutView = React.memo(
  ({
    modLoadout,
    showAvatars = false,
    assignedCharacter,
    assignedTarget,
  }: ComponentProps) => {
    const modDetails = (Object.keys(modLoadout) as ModTypes.GIMOSlots[])
      .filter(slot => null !== modLoadout[slot])
      .map(slot =>
        <div className={'mod ' + slot} key={modLoadout[slot]!.id}>
          {assignedCharacter && assignedTarget && modLoadout[slot]!.shouldLevel(assignedTarget) &&
          <span className={'icon level active'} />
          }
          {assignedCharacter && assignedTarget && modLoadout[slot]!.shouldSlice(assignedCharacter, assignedTarget) &&
          <span className={'icon slice active'} />
          }
          <ModImage
            mod={modLoadout[slot]!}
            showAvatar={showAvatars}
            className={assignedCharacter && modLoadout[slot]!.characterID === assignedCharacter.baseID ? 'no-move' : ''}
          />
          <ModStats
            mod={modLoadout[slot]!}
            showAvatar
            assignedCharacter={assignedCharacter}
            assignedTarget={assignedTarget}
          />
        </div>
    );

    return (
      <div className={'mod-set-view'}>
        {modDetails}
      </div>
    );
  }
);

ModLoadoutView.displayName = 'ModLoadoutView';

export { ModLoadoutView };
