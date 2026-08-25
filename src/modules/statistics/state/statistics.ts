// state
import { type ObservableObject, observable } from "@legendapp/state";

import { mods$ } from "#/modules/mods/state/mods";
import { modsView$ } from "#/modules/modsView/state/modsView";

// domain
import type { StatisticsObservable } from "../domain/StatisticsObservable";

const statistics$: ObservableObject<StatisticsObservable> =
	observable<StatisticsObservable>({
		allMods: () => {
			return Array.from(mods$.activeModById.values());
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
	});

export { statistics$ };
