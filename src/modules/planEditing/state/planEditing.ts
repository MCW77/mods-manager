// state
import { beginBatch, endBatch, observable } from "@legendapp/state";

// domain
import { characterSettings } from "#/constants/characterSettings";
import setBonuses from "#/constants/setbonuses";
import type { PlanEditing } from "../domain/PlanEditing";
import type { CharacterSettings } from "#/domain/CharacterSettings";
import * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { SetRestrictions } from "#/domain/SetRestrictions";
import type { SetStats } from "#/domain/Stats";
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
		return character.targets.map((target) => target.name);
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
			target$.target.name.get() === target$.uneditedTarget.name.get()
		);
	},
	hasAChangedName: () => {
		return target$.target.name.get() !== target$.uneditedTarget.name.get();
	},
	isUnsaveable: () => {
		return (
			(target$.isBuiltinTarget.get() && !target$.hasAChangedName.get()) ||
			!target$.isTargetChanged.get() ||
			(target$.isUsedTargetName.get() && target$.hasAChangedName.get())
		);
	},
	isUsedTargetName: () =>
		target$.namesOfAllTargets.get().includes(target$.target.name.get()),
	isBuiltinTarget: () =>
		(
			characterSettings[target$.characterId.peek()] as CharacterSettings
		)?.targets.some(
			(target) => target.name === target$.uneditedTarget.get().name,
		),
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
			target$.target.name.set(`${target$.target.name.peek()}*`);
		}
		return targetChanged;
	},
	uneditedTarget: { ...target },
	addSetBonus: (setName: SetStats.GIMOStatNames) => {
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
			SetStats.GIMOStatNames,
			number,
		][];
		const requiredSlots = newRestrictionsKVs.reduce(
			(acc, [setName, count]: [SetStats.GIMOStatNames, number]) =>
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
	removeSetBonus: (setName: SetStats.GIMOStatNames) => {
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
