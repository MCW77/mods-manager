// state
import { beginBatch, endBatch, observable } from "@legendapp/state";

// domain
import { characterSettings } from "#/constants/characterSettings";
import setBonuses from "#/constants/setbonuses";
import type { PlanEditing } from "../domain/PlanEditing";
import type { CharacterSettings } from "#/domain/CharacterSettings";
import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";
import * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { SetRestrictions } from "#/domain/SetRestrictions";
import { createTargetStat, type TargetStat } from "#/domain/TargetStat";

const target = OptimizationPlan.createOptimizationPlan("");

const target$: PlanEditing = observable({
	characterId: "PAO",
	target: target,
	namesOfUserTargets: [] as string[],
	namesOfBuiltinTargets: () => {
		const character = characterSettings[
			target$.characterId.get()
		] as CharacterSettings;
		if (!character) {
			return [];
		}
		return character.targets.map((target) => target.id);
	},
	namesOfAllTargets: () => {
		return [
			...target$.namesOfBuiltinTargets.get(),
			...target$.namesOfUserTargets.get(),
		];
	},
	canDeleteTarget: () => {
		return (
			!target$.isBuiltinTarget.get() &&
			target$.isUsedTargetName.get() &&
			target$.target.id.get() === target$.uneditedTarget.id.get()
		);
	},
	hasAChangedName: () => {
		return target$.target.id.get() !== target$.uneditedTarget.id.get();
	},
	isUnsaveable: () => {
		return (
			target$.target.id.get() === "" ||
			(target$.isBuiltinTarget.get() && !target$.hasAChangedName.get()) ||
			!target$.isTargetChanged.get() ||
			(target$.isUsedTargetName.get() && target$.hasAChangedName.get())
		);
	},
	isUsedTargetName: () =>
		target$.namesOfAllTargets.get().includes(target$.target.id.get()),
	isBuiltinTarget: () =>
		(
			characterSettings[target$.characterId.peek()] as CharacterSettings
		)?.targets.some((target) => target.id === target$.uneditedTarget.get().id),
	isInAdvancedEditMode: false,
	isTargetChanged: () => {
		const targetChanged = !OptimizationPlan.equals(
			target$.uneditedTarget.get() ?? target$.target.get(),
			target$.target.get(),
			true,
		);
		if (
			targetChanged &&
			target$.isBuiltinTarget.peek() &&
			target$.isUsedTargetName.peek()
		) {
			target$.target.id.set(`${target$.target.id.peek()}*`);
		}
		return targetChanged;
	},
	uneditedTarget: { ...target },
	addSetBonus: (setName: GIMOSetStatNames) => {
		const restrictions = target$.target.setRestrictions.peek();

		let newRestrictions: SetRestrictions;
		if (restrictions[setName] !== undefined) {
			newRestrictions = {
				...restrictions,
				[setName]: restrictions[setName] + 1,
			};
		} else {
			newRestrictions = { ...restrictions, [setName]: 1 };
		}
		const newRestrictionsKVs = Object.entries(newRestrictions) as [
			GIMOSetStatNames,
			number,
		][];
		const requiredSlots = newRestrictionsKVs.reduce(
			(acc, [setName, count]: [GIMOSetStatNames, number]) =>
				acc + setBonuses[setName].numberOfModsRequired * count,
			0,
		);
		if (requiredSlots <= 6) {
			target$.target.setRestrictions.set(newRestrictions);
		}
	},
	addTargetStat: () => {
		target$.target.targetStats.push(createTargetStat("Speed"));
	},
	removeSetBonus: (setName: GIMOSetStatNames) => {
		const restrictions = target$.target.setRestrictions.peek();
		if (restrictions[setName] !== undefined) {
			if (restrictions[setName] > 1) {
				target$.target.setRestrictions[setName].set(restrictions[setName] - 1);
			} else {
				target$.target.setRestrictions[setName].delete();
			}
		}
	},
	removeTargetStatById: (id: string) => {
		const index = target$.target.targetStats
			.peek()
			.findIndex((ts: TargetStat) => ts.id === id);
		if (index !== -1) {
			target$.target.targetStats.splice(index, 1);
		}
	},
	zeroAll: () => {
		beginBatch();
		target$.target.Health.set(0);
		target$.target.Protection.set(0);
		target$.target.Speed.set(0);
		target$.target["Critical Damage %"].set(0);
		target$.target["Potency %"].set(0);
		target$.target["Tenacity %"].set(0);
		target$.target["Physical Damage"].set(0);
		target$.target["Special Damage"].set(0);
		target$.target["Critical Chance"].set(0);
		target$.target.Armor.set(0);
		target$.target.Resistance.set(0);
		target$.target["Accuracy %"].set(0);
		target$.target["Critical Avoidance %"].set(0);
		endBatch();
	},
});

export { target$ };
