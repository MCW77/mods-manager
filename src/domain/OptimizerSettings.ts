// utils
import groupByKey from "../utils/groupByKey";

// domain
import type { OptimizationPlan } from "./OptimizationPlan";

export interface OptimizerSettings {
  targets: OptimizationPlan[],
}

export const defaultSettings = {
  targets: [],
};

export const createOptimizerSettings = (
  targets: OptimizationPlan[],
) => {
  return {
    targets,
  };
}

export const withTarget = (settings: OptimizerSettings, target: OptimizationPlan) => {
  const targetsObject = groupByKey(settings.targets, target => target.name);
  const newTargetsObject = Object.assign({}, targetsObject, { [target.name]: target });

  return createOptimizerSettings(
    Object.values(newTargetsObject),
  );
}

export const  withTargetOverrides = (settings: OptimizerSettings, targets: OptimizationPlan[]) => {
  const oldTargetsObject = groupByKey(settings.targets, target => target.name);
  const newTargetsObject = groupByKey(targets, target => target.name);

  return createOptimizerSettings(
    Object.values(Object.assign({}, oldTargetsObject, newTargetsObject)),
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
  );
}
