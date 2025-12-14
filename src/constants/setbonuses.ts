import { SetStats } from "../domain/Stats";
import SetBonus from "../domain/SetBonus";
import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";

type SetBonuses = Record<GIMOSetStatNames, SetBonus>;

const setBonuses: SetBonuses = {
	"Health %": new SetBonus(
		"Health %",
		2,
		new SetStats.SetStat("Health %", "5"),
		new SetStats.SetStat("Health %", "10"),
	),
	"Defense %": new SetBonus(
		"Defense %",
		2,
		new SetStats.SetStat("Defense %", "12.5"),
		new SetStats.SetStat("Defense %", "25"),
	),
	"Critical Damage %": new SetBonus(
		"Critical Damage %",
		4,
		new SetStats.SetStat("Critical Damage %", "15"),
		new SetStats.SetStat("Critical Damage %", "30"),
	),
	"Critical Chance %": new SetBonus(
		"Critical Chance %",
		2,
		new SetStats.SetStat("Critical Chance %", "4"),
		new SetStats.SetStat("Critical Chance %", "8"),
	),
	"Tenacity %": new SetBonus(
		"Tenacity %",
		2,
		new SetStats.SetStat("Tenacity %", "10"),
		new SetStats.SetStat("Tenacity %", "20"),
	),
	"Offense %": new SetBonus(
		"Offense %",
		4,
		new SetStats.SetStat("Offense %", "7.5"),
		new SetStats.SetStat("Offense %", "15"),
	),
	"Potency %": new SetBonus(
		"Potency %",
		2,
		new SetStats.SetStat("Potency %", "7.5"),
		new SetStats.SetStat("Potency %", "15"),
	),
	"Speed %": new SetBonus(
		"Speed %",
		4,
		new SetStats.SetStat("Speed %", "5"),
		new SetStats.SetStat("Speed %", "10"),
	),
};

Object.freeze(setBonuses);

export default setBonuses;
export type { SetBonuses };
