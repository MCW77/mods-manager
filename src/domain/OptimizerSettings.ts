// utils
import groupByKey from "../utils/groupByKey";

// domain
import { FlatOptimizationPlan, OptimizationPlan } from "./OptimizationPlan";


export interface IOptimizerSettings {
  target? : FlatOptimizationPlan | null,
  isLocked: boolean,
  minimumModDots: number,
  sliceMods: boolean,
  targets: FlatOptimizationPlan[],
  useOnly5DotMods?: boolean
}
export class OptimizerSettings implements IOptimizerSettings{
  // TODO: Deprecate target - it will now be part of selected characters
  target;
  targets;
  minimumModDots;
  sliceMods;
  isLocked;

  static Default = new OptimizerSettings(
    null,
    [],
    1,
    false,
    false
  );

  /**
   * @param target OptimizationPlan
   * @param targets Array[OptimizationPlan]
   * @param minimumModDots Integer
   * @param sliceMods Boolean
   * @param isLocked Boolean
   */
  constructor(
    target: OptimizationPlan | null,
    targets: OptimizationPlan[],
    minimumModDots: number,
    sliceMods: boolean,
    isLocked: boolean,
  ) {
    this.target = target ?? null;
    this.targets = targets;
    this.minimumModDots = minimumModDots;
    this.sliceMods = sliceMods;
    this.isLocked = isLocked;
    Object.freeze(this);
  }

  /**
   * Return a new OptimizerSettings object that matches this one with the target overridden. If the target also exists
   * in the array of targets, then modify it there as well.
   * @param target OptimizationPlan
   */
  withTarget(target: OptimizationPlan | null) {
    if (target === null) {
      return this;
    }

    const targetsObject = groupByKey(this.targets, target => target.name);
    const newTargetsObject = ['lock', 'custom'].includes(target.name) ?
      this.targets :
      Object.assign({}, targetsObject, { [target.name]: target });

    return new OptimizerSettings(
      null,
      Object.values(newTargetsObject),
      this.minimumModDots,
      this.sliceMods,
      this.isLocked
    );
  }

  /**
   * Return a new OptimizerSettings object that matches this one, but with the targets overridden with the passed-in
   * targets. Any targets that match in name will be replaced, and those that don't will be unchanged.
   * @param targets Array[OptimizationPlan]
   */
  withTargetOverrides(targets: OptimizationPlan[]) {
    const oldTargetsObject = groupByKey(this.targets, target => target.name);
    const newTargetsObject = groupByKey(targets, target => target.name);

    return new OptimizerSettings(
      null,
      Object.values(Object.assign({}, oldTargetsObject, newTargetsObject)),
      this.minimumModDots,
      this.sliceMods,
      this.isLocked
    );
  }

  /**
   * Return a new OptimizerSettings object that matches this one, but with the given target deleted
   *
   * @param targetName {String} The name of the target to delete
   */
  withDeletedTarget(targetName: string) {
    const newTargets = this.targets.slice();
    const targetIndex = newTargets.findIndex(target => target.name === targetName);
    if (-1 !== targetIndex) {
      newTargets.splice(targetIndex, 1);
    }

    return new OptimizerSettings(
      null,
      newTargets,
      this.minimumModDots,
      this.sliceMods,
      this.isLocked
    );
  }

  lock() {
    return new OptimizerSettings(
      this.target,
      this.targets,
      this.minimumModDots,
      this.sliceMods,
      true
    );
  }

  unlock() {
    return new OptimizerSettings(
      this.target,
      this.targets,
      this.minimumModDots,
      this.sliceMods,
      false
    );
  }

  withMinimumModDots(minimumModDots: number) {
    return new OptimizerSettings(
      this.target,
      this.targets,
      minimumModDots,
      this.sliceMods,
      this.isLocked
    );
  }

  withModSlicing(sliceMods: boolean) {
    return new OptimizerSettings(
      this.target,
      this.targets,
      this.minimumModDots,
      sliceMods,
      this.isLocked
    );
  }

  serialize() {
    return {
      targets: this.targets.map(target => target.serialize()),
      minimumModDots: this.minimumModDots,
      sliceMods: this.sliceMods,
      isLocked: this.isLocked
    } as IOptimizerSettings
  }

  static deserialize(settings: IOptimizerSettings) {
    if (settings) {
      let minimumModDots;

      if (settings.minimumModDots) {
        minimumModDots = settings.minimumModDots;
      } else if (settings.useOnly5DotMods) {
        minimumModDots = 5;
      } else {
        minimumModDots = 1;
      }

      return new OptimizerSettings(
        settings.target ? OptimizationPlan.deserialize(settings.target) : null,
        settings.targets.map(OptimizationPlan.deserialize),
        minimumModDots,
        settings.sliceMods || false,
        settings.isLocked
      );
    } else {
      return null;
    }
  }
}