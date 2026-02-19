/**
 * Baseline Tests for Stat Calculations
 *
 * These tests capture the current behavior using big.js before migration to scaled integers.
 * They ensure that calculations produce identical results after the migration.
 */

import { describe, expect, it } from "vitest";
import { Mod } from "../../domain/Mod";
import { SecondaryStat } from "../../domain/SecondaryStat";
import { modScores$ } from "#/modules/modScores/state/modScores";

describe("SecondaryStat Calculations", () => {
	describe("upgrade()", () => {
		it("should upgrade Critical Chance % correctly (factor: 1.045)", () => {
			const stat = new SecondaryStat("test", "Critical Chance %", "1.5", 1);
			const upgraded = stat.upgrade();

			// 1.5 * 1.045 = 1.5675
			expect(upgraded.value).toBeCloseTo(1.5675, 6);
		});

		it("should upgrade Defense correctly (factor: 1.63)", () => {
			const stat = new SecondaryStat("test", "Defense", "10", 2);
			const upgraded = stat.upgrade();

			// 10 * 1.63 = 16.3
			expect(upgraded.value).toBeCloseTo(16.3, 6);
		});

		it("should upgrade Defense % correctly (factor: 2.34)", () => {
			const stat = new SecondaryStat("test", "Defense %", "2", 3);
			const upgraded = stat.upgrade();

			// 2 * 2.34 = 4.68
			expect(upgraded.value).toBeCloseTo(4.68, 6);
		});

		it("should upgrade Offense % correctly (factor: 3.02)", () => {
			const stat = new SecondaryStat("test", "Offense %", "1", 1);
			const upgraded = stat.upgrade();

			// 1 * 3.02 = 3.02
			expect(upgraded.value).toBeCloseTo(3.02, 6);
		});

		it("should upgrade Speed with special +1 handling", () => {
			const stat = new SecondaryStat("test", "Speed", "5", 1);
			const upgraded = stat.upgrade();

			// 5 * 1 + 1 = 6
			expect(upgraded.value).toBe(6);
		});

		it("should upgrade decimal Speed values with special +1 handling", () => {
			const stat = new SecondaryStat("test", "Speed", "5.5", 1);
			const upgraded = stat.upgrade();

			// 5.5 * 1 + 1 = 6.5
			expect(upgraded.value).toBe(6.5);
		});
	});

	describe("downgrade()", () => {
		it("should downgrade Critical Chance % correctly (factor: 1.045)", () => {
			const stat = new SecondaryStat("test", "Critical Chance %", "1.5675", 1);
			const downgraded = stat.downgrade();

			// 1.5675 / 1.045 ≈ 1.5
			expect(downgraded.value).toBeCloseTo(1.5, 6);
		});

		it("should downgrade Defense correctly (factor: 1.63)", () => {
			const stat = new SecondaryStat("test", "Defense", "16.3", 2);
			const downgraded = stat.downgrade();

			// 16.3 / 1.63 = 10
			expect(downgraded.value).toBeCloseTo(10, 6);
		});

		it("should downgrade Speed with special -1 handling", () => {
			const stat = new SecondaryStat("test", "Speed", "6", 1);
			const downgraded = stat.downgrade();

			// 6 / 1 - 1 = 5
			expect(downgraded.value).toBe(5);
		});

		it("should downgrade decimal Speed values with special -1 handling", () => {
			const stat = new SecondaryStat("test", "Speed", "6.5", 1);
			const downgraded = stat.downgrade();

			// 6.5 / 1 - 1 = 5.5
			expect(downgraded.value).toBe(5.5);
		});
	});

	describe("round-trip upgrade/downgrade", () => {
		it("should preserve original value through upgrade/downgrade cycle", () => {
			const original = new SecondaryStat("test", "Critical Chance %", "1.5", 1);
			const upgraded = original.upgrade();
			const downgraded = upgraded.downgrade();

			expect(downgraded.value).toBeCloseTo(original.value, 6);
		});

		it("should preserve Speed value through upgrade/downgrade cycle", () => {
			const original = new SecondaryStat("test", "Speed", "5", 1);
			const upgraded = original.upgrade();
			const downgraded = upgraded.downgrade();

			expect(downgraded.value).toBe(original.value);
		});
	});
});

describe("Mod Scoring Calculations", () => {
	describe("calculatePureSecondaries()", () => {
		it("should calculate score for mod with multiple secondaries", () => {
			const mod = Mod.fromHotUtils({
				mod_uid: "test-mod",
				slot: "Transmitter",
				set: "Speedpercentadditive",
				level: 15,
				pips: 5,
				primaryBonusType: "Offense %",
				primaryBonusValue: "5.88",
				secondaryType_1: "Speed",
				secondaryValue_1: "14",
				secondaryRoll_1: "3",
				secondaryType_2: "Crit Chance %",
				secondaryValue_2: "1.5",
				secondaryRoll_2: "2",
				secondaryType_3: "Offense",
				secondaryValue_3: "45",
				secondaryRoll_3: "1",
				secondaryType_4: "Protection %",
				secondaryValue_4: "2.5",
				secondaryRoll_4: "1",
				characterID: "null",
				tier: 5,
				reRolledCount: 0,
			});

			const score = modScores$.getModScore(mod, "PureSecondaries").value;

			// Verify calculation produces expected result
			expect(score).toMatchSnapshot();
		});
	});

	describe("calculateGIMOOffenseScore()", () => {
		it("should calculate GIMO offense score", () => {
			const mod = Mod.fromHotUtils({
				mod_uid: "test-mod",
				slot: "Transmitter",
				set: "Offense",
				level: 15,
				pips: 5,
				primaryBonusType: "Offense %",
				primaryBonusValue: "5.88",
				secondaryType_1: "Speed",
				secondaryValue_1: "20",
				secondaryRoll_1: "5",
				secondaryType_2: "Offense %",
				secondaryValue_2: "2.5",
				secondaryRoll_2: "3",
				secondaryType_3: "Crit Chance %",
				secondaryValue_3: "3.8",
				secondaryRoll_3: "4",
				secondaryType_4: "Protection %",
				secondaryValue_4: "1.2",
				secondaryRoll_4: "1",
				characterID: "null",
				tier: 5,
				reRolledCount: 0,
			});

			const score = modScores$.getModScore(mod, "GIMOOffense").value;

			// Verify calculation produces expected result
			expect(score).toMatchSnapshot();
		});
	});
});
