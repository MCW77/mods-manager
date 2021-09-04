import { AnyAction } from "redux";
import * as Actions from "../actions/characterEdit";
import { IAppState, SetRestrictions } from "state/storage";
import setBonuses from "../../constants/setbonuses";
import generateKey from "../../utils/generateKey";
import { TargetStats } from "domain/TargetStat";
import { SetStats } from "domain/Stats";

export function changeCharacterEditMode(state: IAppState, action: ReturnType<typeof Actions.changeCharacterEditMode>) {
  return Object.assign({}, state, {
    characterEditMode: action.mode
  });
}

export function changeCharacterFilter(state: IAppState, action: AnyAction) {
  return Object.assign({}, state, {
    characterFilter: action.filter
  });
}

export function toggleHideSelectedCharacters(state: IAppState, action: AnyAction) {
  return Object.assign({}, state, {
    hideSelectedCharacters: !state.hideSelectedCharacters
  });
}

export function toggleCharacterEditSortView(state: IAppState, action: AnyAction) {
  return Object.assign({}, state, {
    characterEditSortView: !state.characterEditSortView
  })
}

export function changeSetRestrictions(state: IAppState, action: ReturnType<typeof Actions.changeSetRestrictions>) {
  return Object.assign({}, state, {
    setRestrictions: action.setRestrictions
  });
}

export function selectSetBonus(state: IAppState, action: ReturnType<typeof Actions.selectSetBonus>) {
  const currentRestrictions = Object.assign({}, state.setRestrictions);
  const updatedRestrictions: SetRestrictions = Object.assign({}, currentRestrictions, {
    [action.setBonus]: (currentRestrictions[action.setBonus] || 0) + 1
  });

  // Only update the set restrictions if the sets can still be fulfilled
  const updatedRestrictionsKVs = Object.entries(updatedRestrictions) as [SetStats.GIMOStatNames, number][];
  const requiredSlots = updatedRestrictionsKVs.reduce((acc, [setName, count]: [SetStats.GIMOStatNames, number]) =>
    acc + setBonuses[setName].numberOfModsRequired * count, 0);

  if (requiredSlots <= 6) {
    return Object.assign({}, state, {
      setRestrictions: updatedRestrictions
    });
  } else {
    return state;
  }
}

export function removeSetBonus(state: IAppState, action: ReturnType<typeof Actions.removeSetBonus>): IAppState {
  const currentRestrictions = Object.assign({}, state.setRestrictions);

  if (currentRestrictions[action.setBonus] && currentRestrictions[action.setBonus] > 1) {
    return Object.assign({}, state, {
      setRestrictions: Object.assign({}, currentRestrictions, {
        [action.setBonus]: currentRestrictions[action.setBonus] - 1
      })
    });
  } else if (currentRestrictions[action.setBonus] && currentRestrictions[action.setBonus] === 1) {
    delete currentRestrictions[action.setBonus];
    return Object.assign({}, state, {
      setRestrictions: Object.assign({}, currentRestrictions)
    });
  }

  return state;
}

export function changeTargetStats(state: IAppState, action: ReturnType<typeof Actions.changeTargetStats>) {
  return Object.assign({}, state, {
    targetStats: action.targetStats.length > 0 ? action.targetStats.map(targetStat => ({
      key: generateKey(24),
      target: targetStat
    })) as TargetStats :
      [] as TargetStats
  }) as IAppState;
}

export function addTargetStat(state: IAppState, action: ReturnType<typeof Actions.addTargetStat>) {
  return Object.assign({}, state, {
    targetStats: state.targetStats.concat({
      key: generateKey(24),
      target: action.targetStat
    })
  });
}

export function removeTargetStat(state: IAppState, action: ReturnType<typeof Actions.removeTargetStat>) {
  const newTargetStats = state.targetStats.slice(0);

  newTargetStats.splice(action.index, 1);
  return Object.assign({}, state, {
    targetStats: newTargetStats
  });
}
