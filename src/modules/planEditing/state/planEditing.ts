// state
import { beginBatch, endBatch, observable } from "@legendapp/state";

// domain
import { characterSettings } from "#/constants/characterSettings";
import setBonuses from "#/constants/setbonuses";
import type { PlanEditing } from "../domain/PlanEditing";
import type { CharacterSettings } from "#/domain/CharacterSettings";
import type { CharacterStats } from "#/domain/CharacterStats";
import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";
import * as OptimizationPlan from "#/domain/OptimizationPlan";
import type { SetRestrictions } from "#/domain/SetRestrictions";
import { createTargetStat, type TargetStat } from "#/domain/TargetStat";

const target = OptimizationPlan.createOptimizationPlan("");
const API_URL = "https://mods-manager.pages.dev/characterTemplates";

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
	changeSimulatedRelicLevel: async (level: number) => {
		const isCharacterTemplates = (
			obj: unknown,
		): obj is {
			templateKey: string;
			data: { statDict: Record<string, number> };
		}[] => {
			if (!Array.isArray(obj)) {
				return false;
			}
			return obj.every(
				(
					item,
				): item is {
					templateKey: string;
					data: { statDict: Record<string, number> };
				} => {
					return (
						typeof item === "object" &&
						item !== null &&
						"templateKey" in item &&
						typeof item.templateKey === "string" &&
						"data" in item &&
						typeof item.data === "object" &&
						item.data !== null &&
						"statDict" in item.data &&
						typeof item.data.statDict === "object" &&
						item.data.statDict !== null
					);
				},
			);
		};

		target$.target.simulatedRelicLevel.set(level);
		if (level === 0) {
			target$.target.simulatedStats.set(null);
		} else {
			const characterId = target$.characterId.get();
			const characterTemplatesResponse = await fetch(API_URL, {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					character: characterId,
				}),
				mode: "cors",
			});
			const characterTemplates = await characterTemplatesResponse.json();
			if (isCharacterTemplates(characterTemplates)) {
				const templateKeys = new Map<number, string>([
					[2, "GEAR_13"],
					[3, "RELIC_1"],
					[4, "RELIC_2"],
					[5, "RELIC_3"],
					[6, "RELIC_4"],
					[7, "RELIC_5"],
					[8, "RELIC_6"],
					[9, "RELIC_7"],
					[10, "RELIC_8"],
					[11, "RELIC_9"],
					[12, "RELIC_10"],
				]);
				const template = characterTemplates.find(
					(template) => template.templateKey === templateKeys.get(level),
				);
				if (template === undefined || template === null) {
					console.error(
						"Template not found for character:",
						characterId,
						"and level:",
						level,
					);
					return;
				}

				let armor = template.data.statDict[8] ?? 0;
				let resistance = template.data.statDict[9] ?? 0;
				armor = (armor * 85 * 7.5) / (100 - armor);
				resistance = (resistance * 85 * 7.5) / (100 - resistance);
				const simulatedStats: CharacterStats = {
					Health: template.data.statDict[1] ?? 0,
					Protection: template.data.statDict[28] ?? 0,
					Speed: template.data.statDict[5] ?? 0,
					"Critical Damage %": (template.data.statDict[16] ?? 0) * 100,
					"Potency %": (template.data.statDict[17] ?? 0) * 100,
					"Tenacity %": (template.data.statDict[18] ?? 0) * 100,
					"Physical Damage": template.data.statDict[6] ?? 0,
					"Special Damage": template.data.statDict[7] ?? 0,
					"Physical Critical Chance %": template.data.statDict[14] ?? 0,
					"Special Critical Chance %": template.data.statDict[15] ?? 0,
					Armor: armor,
					Resistance: resistance,
					"Accuracy %": template.data.statDict[37] ?? 0,
					"Critical Avoidance %": template.data.statDict[39] ?? 0,
				};
				target$.target.simulatedStats.set(simulatedStats);
				return;
			}
			console.error(
				"Invalid character templates response:",
				characterTemplates,
			);
			return;
		}
	},
});

export { target$ };
