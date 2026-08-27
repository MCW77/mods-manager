// state
import { type ObservableObject, observable } from "@legendapp/state";

import { defaultCompilation$ } from "#/modules/defaultCompilation/state/defaultCompilation";
import { mods$ } from "#/modules/mods/state/mods";
import { modsView$ } from "#/modules/modsView/state/modsView";
import { roster$ } from "#/modules/roster/state/roster";

// domain
import type { StatisticsObservable } from "../domain/StatisticsObservable";
import type { Combination, CombinationKey } from "#/domain/Combination";
import type { Mod } from "#/domain/Mod";
import { gimoSlots } from "#/domain/types/ModTypes";

const statistics$: ObservableObject<StatisticsObservable> =
	observable<StatisticsObservable>({
		allMods: () => {
			return Array.from(mods$.activeModById.values());
		},
		modsByModset: () => {
			const mods = modsView$.filteredMods.get();
			const modsByModset = new Map<string, Mod[]>();
			for (const mod of mods) {
				const modset = mod.modset;
				if (!modsByModset.has(modset)) {
					modsByModset.set(modset, []);
				}
				modsByModset.get(modset)?.push(mod);
			}
			return Array.from(modsByModset.entries()).map(([modset, mods]) => ({
				modset,
				count: mods.length,
			}));
		},
		modsBySlot: () => {
			const mods = modsView$.filteredMods.get();
			const resultModsBySlot = [];
			const modsBySpeed = new Map<number, Mod[]>();
			for (const mod of mods) {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				if (speedSecondaryStat) {
					const speed = Number(speedSecondaryStat.stringValue);
					if (!modsBySpeed.has(speed)) {
						modsBySpeed.set(speed, []);
					}
					modsBySpeed.get(speed)?.push(mod);
				} else {
					if (mod.primaryStat.type === "Speed") {
						const speed = Number(mod.primaryStat.stringValue);
						if (!modsBySpeed.has(speed)) {
							modsBySpeed.set(speed, []);
						}
						modsBySpeed.get(speed)?.push(mod);
					} else {
						if (!modsBySpeed.has(0)) {
							modsBySpeed.set(0, []);
						}
						modsBySpeed.get(0)?.push(mod);
					}
				}
			}
			for (const [speed, speedMods] of modsBySpeed.entries()) {
				const squareMods = speedMods.filter((mod) => mod.slot === "square");
				const arrowMods = speedMods.filter((mod) => mod.slot === "arrow");
				const diamondMods = speedMods.filter((mod) => mod.slot === "diamond");
				const triangleMods = speedMods.filter((mod) => mod.slot === "triangle");
				const circleMods = speedMods.filter((mod) => mod.slot === "circle");
				const crossMods = speedMods.filter((mod) => mod.slot === "cross");
				resultModsBySlot.push({
					speed,
					square: squareMods.length,
					arrow: arrowMods.length,
					diamond: diamondMods.length,
					triangle: triangleMods.length,
					circle: circleMods.length,
					cross: crossMods.length,
				});
			}
			return resultModsBySlot;
		},
		defenseSecondaryMods: () => {
			const filteredMods = modsView$.filteredMods.get();
			return filteredMods.filter((mod) => {
				const defenseSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Defense %",
				);
				return defenseSecondaryStat !== undefined;
			});
		},
		defense9OrGreater: () => {
			const defenseMods = statistics$.defenseSecondaryMods.get();
			const defenseModsGreaterThan9 = defenseMods.filter((mod) => {
				const defenseSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Defense %",
				);
				return (
					defenseSecondaryStat !== undefined &&
					Number(defenseSecondaryStat.stringValue) >= 9
				);
			});
			return defenseModsGreaterThan9.length;
		},
		defense14OrGreater: () => {
			const defenseMods = statistics$.defenseSecondaryMods.get();
			const defenseModsGreaterThan14 = defenseMods.filter((mod) => {
				const defenseSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Defense %",
				);
				return (
					defenseSecondaryStat !== undefined &&
					Number(defenseSecondaryStat.stringValue) >= 14
				);
			});
			return defenseModsGreaterThan14.length;
		},
		offenseSecondaryMods: () => {
			const filteredMods = modsView$.filteredMods.get();
			return filteredMods.filter((mod) => {
				const offenseSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Offense %",
				);
				return offenseSecondaryStat !== undefined;
			});
		},
		speedSecondaryMods: () => {
			const filteredMods = modsView$.filteredMods.get();
			return filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				return speedSecondaryStat !== undefined;
			});
		},
		averageSpeed: () => {
			const filteredMods = modsView$.filteredMods.get();
			const nonSpeedArrows = filteredMods.filter(
				(mod) => mod.primaryStat.type !== "Speed",
			);
			const speedMods = nonSpeedArrows.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				return speedSecondaryStat !== undefined;
			});
			const totalSpeed = speedMods.reduce((sum, mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				return (
					sum +
					(speedSecondaryStat ? Number(speedSecondaryStat.stringValue) : 0)
				);
			}, 0);
			return nonSpeedArrows.length > 0 ? totalSpeed / nonSpeedArrows.length : 0;
		},
		offense4OrGreater: () => {
			const offenseMods = statistics$.offenseSecondaryMods.get();
			const offenseModsGreaterThan4 = offenseMods.filter((mod) => {
				const offenseSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Offense %",
				);
				return (
					offenseSecondaryStat && Number(offenseSecondaryStat.stringValue) >= 4
				);
			});
			return offenseModsGreaterThan4.length;
		},
		offense6OrGreater: () => {
			const offenseMods = statistics$.offenseSecondaryMods.get();
			const offenseModsGreaterThan6 = offenseMods.filter((mod) => {
				const offenseSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Offense %",
				);
				return (
					offenseSecondaryStat && Number(offenseSecondaryStat.stringValue) >= 6
				);
			});
			return offenseModsGreaterThan6.length;
		},
		speed10OrGreater: () => {
			const filteredMods = modsView$.filteredMods.get();
			const speedMods = filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed >= 10;
			});
			const speedMods6E = speedMods.filter((mod) => {
				return mod.pips === 6;
			});
			return [speedMods.length - speedMods6E.length, speedMods6E.length];
		},
		speed15OrGreater: () => {
			const filteredMods = modsView$.filteredMods.get();
			const speedMods = filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed >= 15;
			});
			const speedMods6E = speedMods.filter((mod) => {
				return mod.pips === 6;
			});
			return [speedMods.length - speedMods6E.length, speedMods6E.length];
		},
		speed15OrGreaterAllMods: () => {
			const filteredMods = statistics$.allMods.get();
			const speedMods = filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed >= 15;
			});
			return speedMods.length;
		},
		speed20OrGreater: () => {
			const filteredMods = modsView$.filteredMods.get();
			const speedMods = filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed >= 20;
			});
			const speedMods6E = speedMods.filter((mod) => {
				return mod.pips === 6;
			});
			return [speedMods.length - speedMods6E.length, speedMods6E.length];
		},
		speed20OrGreaterAllMods: () => {
			const filteredMods = statistics$.allMods.get();
			const speedMods = filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed >= 20;
			});
			return speedMods.length;
		},
		speed25OrGreater: () => {
			const filteredMods = modsView$.filteredMods.get();
			const speedMods = filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed >= 25;
			});
			const speedMods6E = speedMods.filter((mod) => {
				return mod.pips === 6;
			});
			return [speedMods.length - speedMods6E.length, speedMods6E.length];
		},
		speed25OrGreaterAllMods: () => {
			const filteredMods = statistics$.allMods.get();
			const speedMods = filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed >= 25;
			});
			return speedMods.length;
		},
		speedDistributionAccumulated: () => {
			const speedGreaterThanTen = statistics$.speed10OrGreater.get();
			const speedGreaterThanFifteen = statistics$.speed15OrGreater.get();
			const speedGreaterThanTwenty = statistics$.speed20OrGreater.get();
			const speedGreaterThanTwentyFive = statistics$.speed25OrGreater.get();
			const speedDistribution = [
				{
					speed: 10,
					count5Dot: speedGreaterThanTen[0],
					count6Dot: speedGreaterThanTen[1],
				},
				{
					speed: 15,
					count5Dot: speedGreaterThanFifteen[0],
					count6Dot: speedGreaterThanFifteen[1],
				},
				{
					speed: 20,
					count5Dot: speedGreaterThanTwenty[0],
					count6Dot: speedGreaterThanTwenty[1],
				},
				{
					speed: 25,
					count5Dot: speedGreaterThanTwentyFive[0],
					count6Dot: speedGreaterThanTwentyFive[1],
				},
			];
			return speedDistribution;
		},
		speedDistributionFull: () => {
			const filteredMods = modsView$.filteredMods.get();
			const modsWithoutSpeed = filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed === 0;
			});
			const modsWithoutSpeed6e = modsWithoutSpeed.filter((mod) => {
				return mod.pips === 6;
			});
			const speedDitribution = [
				{
					speed: 0,
					count5Dot: modsWithoutSpeed.length - modsWithoutSpeed6e.length,
					count6Dot: modsWithoutSpeed6e.length,
				},
			];
			for (let speed = 3; speed <= 31; speed++) {
				const speedMods = filteredMods.filter((mod) => {
					const speedSecondaryStat = mod.secondaryStats.find(
						(stat) => stat.type === "Speed",
					);
					const modSpeed =
						speedSecondaryStat !== undefined
							? Number(speedSecondaryStat.stringValue)
							: 0;
					return modSpeed === speed;
				});
				const speedMods6e = speedMods.filter((mod) => {
					return mod.pips === 6;
				});
				const count5Dot = speedMods.length - speedMods6e.length;
				const count6Dot = speedMods6e.length;
				speedDitribution.push({ speed, count5Dot, count6Dot });
			}
			return speedDitribution;
		},
		modQualityDSR: () => {
			const modsSpeedGreaterThan15 = statistics$.speed15OrGreaterAllMods.get();
			return modsSpeedGreaterThan15 / (statistics$.squadGP.get() / 100000);
		},
		modQualityHU: () => {
			const modsSpeedGreaterThan25 = statistics$.speed25OrGreaterAllMods.get();
			const modsSpeed20To24 =
				statistics$.speed20OrGreaterAllMods.get() - modsSpeedGreaterThan25;
			const modsSpeed15To19 =
				statistics$.speed15OrGreaterAllMods.get() -
				modsSpeed20To24 -
				modsSpeedGreaterThan25;
			return (
				(modsSpeed15To19 * 0.8 +
					modsSpeed20To24 +
					modsSpeedGreaterThan25 * 1.6) /
				(statistics$.squadGP.get() / 100000)
			);
		},
		squadGP: () => {
			return roster$.squadGP.get();
		},
		modsToFarm: () => {
			const requirements = defaultCompilation$.hardRequirements.get();
			return requirements;
		},
		modsToFarmOfModset: (modset: string) => {
			const modsToFarm = structuredClone(statistics$.modsToFarm.get());
			const modsRequiredOfModset = new Map<
				CombinationKey,
				{ combination: Combination; count: number }
			>();
			for (const [key, entry] of modsToFarm.entries()) {
				if (entry.combination.modset === modset) {
					modsRequiredOfModset.set(key, entry);
				}
			}

			for (const slot of gimoSlots) {
				const entriesOfSlot = [...modsRequiredOfModset.entries()]
					.filter(
						([, entry]) =>
							entry.combination.slot === slot &&
							entry.combination.modset === modset,
					)
					.sort(([_aKey, aEntry], [_bKey, bEntry]) => {
						return (
							aEntry.combination.primaryStats.length -
							bEntry.combination.primaryStats.length
						);
					});
				if (entriesOfSlot.length === 0) continue;
				const singlePrimaryStatEntries = entriesOfSlot.filter(
					([, entry]) => entry.combination.primaryStats.length === 1,
				);
				const multiplePrimaryStatEntries = entriesOfSlot.filter(
					([, entry]) => entry.combination.primaryStats.length > 1,
				);
				const noPrimaryStatEntries = entriesOfSlot.filter(
					([, entry]) => entry.combination.primaryStats.length === 0,
				);
				const availablePrimaryStatRestrictions = new Set<string>();
				for (const [_key, entry] of entriesOfSlot) {
					for (const primaryStat of entry.combination.primaryStats) {
						availablePrimaryStatRestrictions.add(primaryStat);
					}
				}
				const modsOfSlotAndModsetByPrimaryStat = new Map<string, Mod[]>();
				for (const primaryStat of availablePrimaryStatRestrictions) {
					const modsOfPrimaryStat = statistics$.modsOfSlotAndModset[
						`${slot}-${modset}`
					]
						.get()
						.filter((mod) => {
							return primaryStat === "" || mod.primaryStat.type === primaryStat;
						});
					modsOfSlotAndModsetByPrimaryStat.set(primaryStat, modsOfPrimaryStat);
				}
				const remainingModCountOfPipsByPrimaryStat = new Map<
					string,
					{ pips5: number; pips6: number }
				>();
				for (const primaryStat of availablePrimaryStatRestrictions) {
					const modsOfPrimaryStat =
						modsOfSlotAndModsetByPrimaryStat.get(primaryStat) ?? [];
					const pips5Count = modsOfPrimaryStat.filter(
						(mod) => mod.pips === 5,
					).length;
					const pips6Count = modsOfPrimaryStat.filter(
						(mod) => mod.pips === 6,
					).length;
					remainingModCountOfPipsByPrimaryStat.set(primaryStat, {
						pips5: pips5Count,
						pips6: pips6Count,
					});
				}

				const handleSlotEntries = (
					entries: [
						CombinationKey,
						{ combination: Combination; count: number },
					][],
				) => {
					const visitedCombos = new Set<string>();
					for (const [_key, entry] of entries) {
						const comboKey = `${entry.combination.slot}-${entry.combination.modset}-${entry.combination.primaryStats.join(",")}`;
						if (visitedCombos.has(comboKey)) {
							continue;
						}
						visitedCombos.add(comboKey);
						const primaryStatsKey = entry.combination.primaryStats.join(",");
						const requirement6Dot = entries.find(
							([, entry]) =>
								entry.combination.pips === 6 &&
								entry.combination.primaryStats.join(",") === primaryStatsKey,
						);
						const requirement5Dot = entries.find(
							([, entry]) =>
								entry.combination.pips === 5 &&
								entry.combination.primaryStats.join(",") === primaryStatsKey,
						);

						if (requirement6Dot !== undefined) {
							for (const primaryStat of requirement6Dot[1].combination
								.primaryStats) {
								const remainingMods =
									remainingModCountOfPipsByPrimaryStat.get(primaryStat);
								if (remainingMods === undefined || remainingMods.pips6 <= 0)
									continue;

								const [key6dot, entry6dot] = requirement6Dot;
								const modsTaken = Math.min(
									entry6dot.count,
									remainingMods.pips6,
								);
								entry6dot.count = entry6dot.count - modsTaken;
								remainingMods.pips6 -= modsTaken;
								if (entry6dot.count <= 0) {
									modsRequiredOfModset.delete(key6dot);
									break;
								}
							}
						}

						if (requirement5Dot !== undefined) {
							for (const primaryStat of requirement5Dot[1].combination
								.primaryStats) {
								const remainingMods =
									remainingModCountOfPipsByPrimaryStat.get(primaryStat);
								if (remainingMods === undefined || remainingMods.pips5 <= 0)
									continue;

								const [key5dot, entry5dot] = requirement5Dot;
								const modsTaken6Dot = Math.min(
									entry5dot.count,
									remainingMods.pips6,
								);
								entry5dot.count = entry5dot.count - modsTaken6Dot;

								remainingMods.pips6 -= modsTaken6Dot;
								if (entry5dot.count > 0) {
									const modsTaken5Dot = Math.min(
										entry5dot.count,
										remainingMods.pips5,
									);
									entry5dot.count = entry5dot.count - modsTaken5Dot;
									remainingMods.pips5 -= modsTaken5Dot;
								}

								if (entry5dot.count <= 0) {
									modsRequiredOfModset.delete(key5dot);
									break;
								}
							}
						}
					}
				};

				handleSlotEntries(singlePrimaryStatEntries);
				handleSlotEntries(multiplePrimaryStatEntries);
				handleSlotEntries(noPrimaryStatEntries);
			}

			return modsRequiredOfModset;
		},
		modsOfSlotAndModset: (slotAndModset: string) => {
			const [slot, modset] = slotAndModset.split("-");
			const allMods = statistics$.allMods.get();
			const healthSlotMods = allMods.filter((mod) => {
				return mod.slot === slot && mod.modset === modset;
			});
			return healthSlotMods;
		},
	});

export { statistics$ };
