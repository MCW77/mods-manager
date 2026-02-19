// state
import { ObservableHint } from "@legendapp/state";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import type { ModTiersEnum } from "#/constants/enums";
import type * as ModTypes from "./types/ModTypes";
import type { GIMOSetStatNames } from "./GIMOStatNames";
import type { Pips } from "./Pips";
import { PrimaryStat } from "./PrimaryStat";
import { type Rolls, SecondaryStat } from "./SecondaryStat";
import { SetStat } from "./SetStat";

const HU2GIMOSlotsMap: {
	[key in ModTypes.HUSlots]: ModTypes.GIMOSlots;
} = {
	Transmitter: "square",
	Receiver: "arrow",
	Processor: "diamond",
	"Holo-Array": "triangle",
	"Data-Bus": "circle",
	Multiplexer: "cross",
} as const;

export class Mod {
	id: string;
	slot: ModTypes.GIMOSlots;
	modset: GIMOSetStatNames;
	level: ModTypes.Levels;
	pips: Pips;
	primaryStat: PrimaryStat;
	secondaryStats: SecondaryStat[];
	tier: ModTiersEnum;
	characterID: CharacterNames | "null";
	totalRolls: number;
	maxRoll: number;
	assignedID: CharacterNames | "null";
	reRolledCount: number;
	speedRemainder = 0;

	static reRollPrices = [15, 25, 40, 75, 100, 150];

	constructor(
		id: string,
		slot: ModTypes.GIMOSlots,
		modset: GIMOSetStatNames,
		level: ModTypes.Levels,
		pips: Pips,
		primaryStat: PrimaryStat,
		secondaryStats: SecondaryStat[],
		characterID: CharacterNames | "null",
		reRolledCount: number,
		speedRemainder: number,
		tier: ModTiersEnum = 1,
	) {
		this.id = id;
		this.slot = slot;
		this.modset = modset;
		this.level = level;
		this.pips = pips;
		this.primaryStat = primaryStat;
		this.secondaryStats = secondaryStats;
		this.characterID = characterID;
		this.reRolledCount = reRolledCount;
		this.speedRemainder = speedRemainder;
		this.tier = tier;

		/**
		 * 1. Performance: Marking Mod instances as opaque prevents Legend State from recursively
		 *    traversing and wrapping all nested properties (secondaryStats, primaryStat, etc.)
		 * 2. Arrays: We mark arrays of Mods as opaque using ObservableHint.opaque(array), but the
		 *    individual Mod objects within need this symbol set to prevent deep observation of their
		 *    internal structure
		 * 3. With this we can't observe individual properties of Mod instances.
		 *    Just get/peek the whole Mod and access properties on the raw Mod.
		 */
		ObservableHint.opaque(this);
		for (const stat of this.secondaryStats) {
			if (this.pips === 6) {
				const tempStat = stat.downgrade();
				tempStat.calcScore();
				stat.score = tempStat.score;
			} else {
				stat.calcScore();
			}
		}
		this.totalRolls = this.secondaryStats.reduce(
			(acc, stat) => acc + stat.rolls,
			0,
		);
		this.maxRoll =
			this.secondaryStats
				.map((stat) => stat.rolls)
				.sort()
				.slice(-1)[0] ?? 0;
		this.assignedID = "null";
	}

	isAssigned() {
		return this.assignedID !== "null";
	}

	equip(characterID: CharacterNames) {
		return new Mod(
			this.id,
			this.slot,
			this.modset,
			this.level,
			this.pips,
			this.primaryStat,
			this.secondaryStats,
			characterID,
			this.reRolledCount,
			this.speedRemainder,
			this.tier,
		);
	}

	unequip() {
		return new Mod(
			this.id,
			this.slot,
			this.modset,
			this.level,
			this.pips,
			this.primaryStat,
			this.secondaryStats,
			"null",
			this.reRolledCount,
			this.speedRemainder,
			this.tier,
		);
	}

	/**
	 * Simulate leveling this mod up to level 15, upgrading the primary stat as needed, but not changing any of the
	 * secondary stats
	 * @returns {Mod}
	 */
	levelUp() {
		return new Mod(
			this.id,
			this.slot,
			this.modset,
			15,
			this.pips,
			this.primaryStat.upgrade(this.pips),
			this.secondaryStats,
			this.characterID,
			this.reRolledCount,
			this.speedRemainder,
			this.tier,
		);
	}

	/**
	 * Upgrade all of the stats on this mod to see what it would be like after slicing from 5A to 6E
	 * @returns {Mod}
	 */
	slice() {
		return new Mod(
			this.id,
			this.slot,
			this.modset,
			this.level,
			6,
			this.primaryStat.upgrade(6),
			this.secondaryStats.map((stat) => stat.upgrade()),
			this.characterID,
			this.reRolledCount,
			this.speedRemainder,
			1,
		);
	}

	reRollPrice() {
		const totalCalibrations = this.tier + 1;
		if (this.pips < 6) return 0;
		if (this.reRolledCount >= totalCalibrations) return 0;
		return Mod.reRollPrices[this.reRolledCount];
	}

	/**
	 * Convert this mod to a simple JSON object so that it can be stringified
	 */
	serialize() {
		const [pBT, pBV] = this.primaryStat.serialize();

		const modObject: ModTypes.GIMOFlatMod = {
			mod_uid: this.id,
			slot: this.slot,
			set: this.modset,
			level: this.level,
			pips: this.pips,
			characterID: this.characterID,
			tier: this.tier,
			reRolledCount: this.reRolledCount,
			speedRemainder: this.speedRemainder ?? 0,
			primaryBonusType: pBT,
			primaryBonusValue: pBV,
			secondaryType_1: "Health",
			secondaryValue_1: "400",
			secondaryRoll_1: "1",
			secondaryType_2: "Health %",
			secondaryValue_2: "0.8",
			secondaryRoll_2: "1",
			secondaryType_3: "Speed",
			secondaryValue_3: "5",
			secondaryRoll_3: "1",
			secondaryType_4: "Offense",
			secondaryValue_4: "45",
			secondaryRoll_4: "1",
		};

		for (let i = 0; i < 4; i++) {
			if (i < this.secondaryStats.length) {
				const mO = this.secondaryStats[i].serialize();
				[
					modObject[
						`secondaryType_${i + 1}` as keyof ModTypes.FlatGIMOModTypeIndexer
					],
					modObject[
						`secondaryValue_${i + 1}` as keyof ModTypes.FlatModValueIndexer
					],
					modObject[
						`secondaryRoll_${i + 1}` as keyof ModTypes.FlatModRollIndexer
					],
				] = mO;
			} else {
				modObject[
					`secondaryType_${i + 1}` as keyof ModTypes.FlatGIMOModTypeIndexer
				] = null;
				modObject[
					`secondaryValue_${i + 1}` as keyof ModTypes.FlatModValueIndexer
				] = "";
				modObject[
					`secondaryRoll_${i + 1}` as keyof ModTypes.FlatModRollIndexer
				] = null;
			}
		}

		return modObject;
	}

	static fromHotUtils(flatMod: ModTypes.HUFlatMod) {
		type secondaryPos = "1" | "2" | "3" | "4";
		const secondaryStats: SecondaryStat[] = [];
		for (const pos of ["1", "2", "3", "4"] as secondaryPos[]) {
			const typeKey =
				`secondaryType_${pos}` as keyof ModTypes.FlatHUModTypeIndexer;
			const rollKey =
				`secondaryRoll_${pos}` as keyof ModTypes.FlatModRollIndexer;
			if (
				flatMod[typeKey] !== undefined &&
				flatMod[typeKey] !== null &&
				flatMod[rollKey] !== null
			) {
				secondaryStats.push(
					SecondaryStat.fromHotUtils(
						pos,
						flatMod[typeKey],
						flatMod[
							`secondaryValue_${pos}` as keyof ModTypes.FlatModValueIndexer
						],
						flatMod[rollKey],
					),
				);
			}
		}

		return new Mod(
			flatMod.mod_uid,
			HU2GIMOSlotsMap[flatMod.slot],
			SetStat.HU2GIMOStatNamesMap[flatMod.set],
			flatMod.level,
			flatMod.pips,
			PrimaryStat.fromHotUtils(
				flatMod.primaryBonusType,
				flatMod.primaryBonusValue,
			),
			secondaryStats,
			flatMod.characterID ?? "null",
			flatMod.reRolledCount,
			0,
			flatMod.tier,
		);
	}

	static deserialize(mod: ModTypes.GIMOFlatMod) {
		const primaryStat = new PrimaryStat(
			mod.primaryBonusType,
			mod.primaryBonusValue,
		);
		const secondaryStats: SecondaryStat[] = [];

		if (null !== mod.secondaryType_1 && "" !== mod.secondaryValue_1) {
			secondaryStats.push(
				new SecondaryStat(
					"1",
					mod.secondaryType_1,
					mod.secondaryValue_1,
					+(mod.secondaryRoll_1 ?? 1) as Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_2 && "" !== mod.secondaryValue_2) {
			secondaryStats.push(
				new SecondaryStat(
					"2",
					mod.secondaryType_2,
					mod.secondaryValue_2,
					+(mod.secondaryRoll_2 ?? 1) as Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_3 && "" !== mod.secondaryValue_3) {
			secondaryStats.push(
				new SecondaryStat(
					"3",
					mod.secondaryType_3,
					mod.secondaryValue_3,
					+(mod.secondaryRoll_3 ?? 1) as Rolls,
				),
			);
		}
		if (null !== mod.secondaryType_4 && "" !== mod.secondaryValue_4) {
			secondaryStats.push(
				new SecondaryStat(
					"4",
					mod.secondaryType_4,
					mod.secondaryValue_4,
					+(mod.secondaryRoll_4 ?? 1) as Rolls,
				),
			);
		}

		return new Mod(
			mod.mod_uid,
			mod.slot,
			mod.set,
			mod.level,
			mod.pips,
			primaryStat,
			secondaryStats,
			mod.characterID,
			mod.reRolledCount,
			mod.speedRemainder ?? 0,
			mod.tier,
		);
	}
}
