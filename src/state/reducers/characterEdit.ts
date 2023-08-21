// react
import { createSelector } from "@reduxjs/toolkit";

// utils
import generateKey from "../../utils/generateKey";

// state
import { IAppState } from "../storage";

// modules
import { actions } from "../actions/characterEdit";
import { Storage } from '../modules/storage';

// domain
import setBonuses from "../../constants/setbonuses";

import { SetRestrictions } from '../../domain/SetRestrictions';
import { SetStats } from "../../domain/Stats";
import { TargetStats } from "../../domain/TargetStat";


export namespace reducers {
  export function addTargetStat(state: IAppState, action: ReturnType<typeof actions.addTargetStat>): IAppState {
    return Object.assign({}, state, {
      targetStats: state.targetStats.concat({
        key: generateKey(24),
        target: action.targetStat
      })
    });
  }

  export function changeCharacterEditMode(state: IAppState, action: ReturnType<typeof actions.changeCharacterEditMode>): IAppState {
    return Object.assign({}, state, {
      characterEditMode: action.mode
    });
  }

  export function changeCharacterFilter(state: IAppState, action: ReturnType<typeof actions.changeCharacterFilter>): IAppState {
    return Object.assign({}, state, {
      characterFilter: action.filter
    });
  }

  export function changeSetRestrictions(state: IAppState, action: ReturnType<typeof actions.changeSetRestrictions>): IAppState {
    return Object.assign({}, state, {
      setRestrictions: action.setRestrictions
    });
  }

  export function changeTargetStats(state: IAppState, action: ReturnType<typeof actions.changeTargetStats>): IAppState {
    return Object.assign({}, state, {
      targetStats: action.targetStats.length > 0 ? action.targetStats.map(targetStat => ({
        key: generateKey(24),
        target: targetStat
      })) as TargetStats :
        [] as TargetStats
    });
  }

  export function removeSetBonus(state: IAppState, action: ReturnType<typeof actions.removeSetBonus>): IAppState {
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

  export function removeTargetStat(state: IAppState, action: ReturnType<typeof actions.removeTargetStat>): IAppState {
    const newTargetStats = state.targetStats.slice(0);

    newTargetStats.splice(action.index, 1);
    return Object.assign({}, state, {
      targetStats: newTargetStats
    });
  }

  export function selectSetBonus(state: IAppState, action: ReturnType<typeof actions.selectSetBonus>) {
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

  export function toggleCharacterEditSortView(state: IAppState): IAppState {
    return Object.assign({}, state, {
      characterEditSortView: !state.characterEditSortView
    });
  }

  export function toggleHideSelectedCharacters(state: IAppState): IAppState {
    return Object.assign({}, state, {
      hideSelectedCharacters: !state.hideSelectedCharacters
    });
  }
}

export namespace selectors {
  export const selectCharacterEditMode = (state: IAppState) => state.characterEditMode;
  export const selectSelectedCharactersInActiveProfile = createSelector(
    [Storage.selectors.selectActiveProfile],
    (activeProfile) => activeProfile.selectedCharacters
  );
  export const selectSetRestrictions = (state: IAppState) => state.setRestrictions;
  export const selectTargetStats = (state: IAppState) => state.targetStats;
}
