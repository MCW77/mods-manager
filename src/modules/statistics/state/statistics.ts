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
		speedGreaterThanTen: () => {
			const filteredMods = modsView$.filteredMods.get();
			return filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed > 10;
			}).length;
		},
		speedGreaterThanFifteen: () => {
			const filteredMods = modsView$.filteredMods.get();
			return filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed > 15;
			}).length;
		},
		speedGreaterThanTwenty: () => {
			const filteredMods = modsView$.filteredMods.get();
			return filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed > 20;
			}).length;
		},
		speedGreaterThanTwentyFive: () => {
			const filteredMods = modsView$.filteredMods.get();
			return filteredMods.filter((mod) => {
				const speedSecondaryStat = mod.secondaryStats.find(
					(stat) => stat.type === "Speed",
				);
				const modSpeed =
					speedSecondaryStat !== undefined
						? Number(speedSecondaryStat.stringValue)
						: 0;
				return modSpeed > 25;
			}).length;
		},
		speedDistribution: () => {
			const speedGreaterThanTen = statistics$.speedGreaterThanTen.get();
			const speedGreaterThanFifteen = statistics$.speedGreaterThanFifteen.get();
			const speedGreaterThanTwenty = statistics$.speedGreaterThanTwenty.get();
			const speedGreaterThanTwentyFive =
				statistics$.speedGreaterThanTwentyFive.get();
			const speedDistribution = [
				{ speed: 10, count: speedGreaterThanTen },
				{ speed: 15, count: speedGreaterThanFifteen },
				{ speed: 20, count: speedGreaterThanTwenty },
				{ speed: 25, count: speedGreaterThanTwentyFive },
			];
			return speedDistribution;
		},
	});

export { statistics$ };
