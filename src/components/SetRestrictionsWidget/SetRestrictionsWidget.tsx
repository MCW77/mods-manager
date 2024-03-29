// react
import React from "react";
import { useDispatch } from "react-redux";

// modules
import { CharacterEdit } from "#/state/modules/characterEdit";

// domain
import setBonuses from "#/constants/setbonuses";

import SetBonus from "#/domain/SetBonus";
import { SetRestrictions } from "#/domain/SetRestrictions";
import { SetStats } from "#/domain/Stats";


type ComponentProps = {
  setRestrictions: SetRestrictions,
  useFullSets: boolean,
}

const SetRestrictionsWidget = ({
  setRestrictions,
  useFullSets,
}: ComponentProps) => {
  const dispatch = useDispatch();

  let selectedSets: SetStats.GIMOStatNames[] = [];
  Object.entries(setRestrictions).forEach(([setName, count]) => {
    for (let i = 0; i < count; i++) {
      selectedSets.push(setName as SetStats.GIMOStatNames);
    }
  });
  const emptySlots = 3 - selectedSets.reduce((acc, setName) => acc + setBonuses[setName].numberOfModsRequired / 2, 0);

  const setBonusToFormDisplay = (setBonus: SetBonus, index: number) => {
    const className = setBonus.numberOfModsRequired > (2 * emptySlots) ? 'disabled' : ''
    const setBonusName = setBonus.name.replace(/\s|%/g, '').toLowerCase()
    return <img
      src={`/img/icon_buff_${setBonusName}.png`}
      alt={setBonus.name}
      key={index}
      className={className}
      onClick={() => dispatch(CharacterEdit.actions.selectSetBonus(setBonus.name))}
    />
  };

  const setBonusGroups = [Object.values(setBonuses).slice(0, 4), Object.values(setBonuses).slice(4)];
  const setBonusGroupsDisplay = setBonusGroups.map(setBonuses => setBonuses.map(setBonusToFormDisplay))
  const setBonusDisplay = setBonusGroupsDisplay.map((groupDisplay, index) =>
    <div className="breakable-group" key={index}>{groupDisplay}</div>
  )

  return <div className={'mod-sets'}>
    <div className={'form-row center'}>
      <label htmlFor={'use-full-sets'}>Don't break mod sets</label>
      <input type={'checkbox'} name={'use-full-sets'} id={'use-full-sets'} defaultChecked={useFullSets} />
    </div>
    <p className={'instructions'}>
      Click on a set bonus to add it to or remove it from the selected sets.
    </p>
    <div className={'set-options'}>
      {setBonusDisplay}
    </div>
    <div className={'selected-sets'}>
      <p>Selected Sets:</p>
      <div className="flex gap-2 justify-center">
      {selectedSets.map((setName, index) =>
        <img
          src={`/img/icon_buff_${setName.replace(/\s|%/g, '').toLowerCase()}.png`}
          alt={setName}
          key={index}
          onClick={() => dispatch(CharacterEdit.actions.removeSetBonus(setName))}
        />
      )}
      {Array.from({ length: emptySlots }, (_, index) =>
        <span className={'empty-set'} key={index} />
      )}
      </div>
    </div>
  </div>;
}

SetRestrictionsWidget.displayName = 'SetRestrictionsWidget';

export { SetRestrictionsWidget };