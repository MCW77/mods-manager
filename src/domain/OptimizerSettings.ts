// utils
import groupByKey from "../utils/groupByKey";

// domain
import { OptimizationPlan } from "./OptimizationPlan";

export interface OptimizerSettings {
  isLocked: boolean,
  minimumModDots: number,
  sliceMods: boolean,
  targets: OptimizationPlan[],
}

export const defaultSettings = {
  targets: [],
  minimumModDots: 1,
  sliceMods: false,
  isLocked: false,
};

export const createOptimizerSettings = (
  targets: OptimizationPlan[],
  minimumModDots: number,
  sliceMods: boolean,
  isLocked: boolean,
) => {
  return {
    targets,
    minimumModDots,
    sliceMods,
    isLocked,
  };
}

export const withTarget = (settings: OptimizerSettings, target: OptimizationPlan) => {
  const targetsObject = groupByKey(settings.targets, target => target.name);
  const newTargetsObject = ['lock', 'custom'].includes(target.name) ?
    settings.targets :
    Object.assign({}, targetsObject, { [target.name]: target });

  return createOptimizerSettings(
    Object.values(newTargetsObject),
    settings.minimumModDots,
    settings.sliceMods,
    settings.isLocked
  );
}

export const  withTargetOverrides = (settings: OptimizerSettings, targets: OptimizationPlan[]) => {
  const oldTargetsObject = groupByKey(settings.targets, target => target.name);
  const newTargetsObject = groupByKey(targets, target => target.name);

  return createOptimizerSettings(
    Object.values(Object.assign({}, oldTargetsObject, newTargetsObject)),
    settings.minimumModDots,
    settings.sliceMods,
    settings.isLocked,
  );
}

export const withDeletedTarget = (settings: OptimizerSettings, targetName: string) => {
  const newTargets = settings.targets.slice();
  const targetIndex = newTargets.findIndex(target => target.name === targetName);
  if (-1 !== targetIndex) {
    newTargets.splice(targetIndex, 1);
  }

  return createOptimizerSettings(
    newTargets,
    settings.minimumModDots,
    settings.sliceMods,
    settings.isLocked
  );
}

export const lock = (settings: OptimizerSettings) => {
  return createOptimizerSettings(
    settings.targets,
    settings.minimumModDots,
    settings.sliceMods,
    true
  );
}

export const unlock = (settings: OptimizerSettings) => {
  return createOptimizerSettings(
    settings.targets,
    settings.minimumModDots,
    settings.sliceMods,
    false
  );
}

export const withMinimumModDots = (settings: OptimizerSettings, minimumModDots: number) => {
  return createOptimizerSettings(
    settings.targets,
    minimumModDots,
    settings.sliceMods,
    settings.isLocked
  );
}

export const withModSlicing = (settings: OptimizerSettings, sliceMods: boolean) => {
  return createOptimizerSettings(
    settings.targets,
    settings.minimumModDots,
    sliceMods,
    settings.isLocked
  );
}
