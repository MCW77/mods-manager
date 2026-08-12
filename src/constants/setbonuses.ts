import { createSetStat } from "../domain/SetStat";
import { createSetBonus, type SetBonus } from "../domain/SetBonus";
import type { GIMOSetStatNames } from "#/domain/GIMOStatNames";

type SetBonuses = Record<GIMOSetStatNames, SetBonus>;

const setBonuses: SetBonuses = {
	"Health %": createSetBonus(
		"Health %",
		2,
		createSetStat("Health %", "5"),
		createSetStat("Health %", "10"),
	),
	"Defense %": createSetBonus(
		"Defense %",
		2,
		createSetStat("Defense %", "12.5"),
		createSetStat("Defense %", "25"),
	),
	"Critical Damage %": createSetBonus(
		"Critical Damage %",
		4,
		createSetStat("Critical Damage %", "15"),
		createSetStat("Critical Damage %", "30"),
	),
	"Critical Chance %": createSetBonus(
		"Critical Chance %",
		2,
		createSetStat("Critical Chance %", "4"),
		createSetStat("Critical Chance %", "8"),
	),
	"Tenacity %": createSetBonus(
		"Tenacity %",
		2,
		createSetStat("Tenacity %", "10"),
		createSetStat("Tenacity %", "20"),
	),
	"Offense %": createSetBonus(
		"Offense %",
		4,
		createSetStat("Offense %", "7.5"),
		createSetStat("Offense %", "15"),
	),
	"Potency %": createSetBonus(
		"Potency %",
		2,
		createSetStat("Potency %", "7.5"),
		createSetStat("Potency %", "15"),
	),
	"Speed %": createSetBonus(
		"Speed %",
		4,
		createSetStat("Speed %", "5"),
		createSetStat("Speed %", "10"),
	),
};

Object.freeze(setBonuses);

export default setBonuses;
