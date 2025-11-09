// utils
import { match, P } from "ts-pattern";
// react
import { lazy, memo } from "react";

// state
import { use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type { Mod } from "#/domain/Mod";

// components
const CharacterAvatar = lazy(
	() => import("../CharacterAvatar/CharacterAvatar"),
);
import { Pips } from "../Pips/Pips";
import { Badge } from "../ui/badge";
import { ModTiersEnum } from "#/constants/enums";
import { cn } from "#/lib/utils";

const SET_BG_POSITIONS = {
	// Grey tier (X 0px offset)
	GREY_HEALTH: "bg-[position:-0px_-0px]",
	GREY_OFFENSE: "bg-[position:-24px_-0px]",
	GREY_DEFENSE: "bg-[position:-48px_-0px]",
	GREY_CRIT_CHANCE: "bg-[position:-72px_-0px]",
	GREY_CRIT_DMG: "bg-[position:-96px_-0px]",
	GREY_SPEED: "bg-[position:-120px_-0px]",
	GREY_POTENCY: "bg-[position:-144px_-0px]",
	GREY_TENACITY: "bg-[position:-169px_-0px]",

	// Green tier (X 24px offset)
	GREEN_HEALTH: "bg-[position:-0px_-24px]",
	GREEN_OFFENSE: "bg-[position:-24px_-24px]",
	GREEN_DEFENSE: "bg-[position:-48px_-24px]",
	GREEN_CRIT_CHANCE: "bg-[position:-72px_-24px]",
	GREEN_CRIT_DMG: "bg-[position:-96px_-24px]",
	GREEN_SPEED: "bg-[position:-120px_-24px]",
	GREEN_POTENCY: "bg-[position:-144px_-24px]",
	GREEN_TENACITY: "bg-[position:-169px_-24px]",
	// Blue tier (X 48px offset)
	BLUE_HEALTH: "bg-[position:-0px_-48px]",
	BLUE_OFFENSE: "bg-[position:-24px_-48px]",
	BLUE_DEFENSE: "bg-[position:-48px_-48px]",
	BLUE_CRIT_CHANCE: "bg-[position:-72px_-48px]",
	BLUE_CRIT_DMG: "bg-[position:-96px_-48px]",
	BLUE_SPEED: "bg-[position:-120px_-48px]",
	BLUE_POTENCY: "bg-[position:-144px_-48px]",
	BLUE_TENACITY: "bg-[position:-169px_-48px]",
	// Purple tier (X 72px offset)
	PURPLE_HEALTH: "bg-[position:-0px_-72px]",
	PURPLE_OFFENSE: "bg-[position:-24px_-72px]",
	PURPLE_DEFENSE: "bg-[position:-48px_-72px]",
	PURPLE_CRIT_CHANCE: "bg-[position:-72px_-72px]",
	PURPLE_CRIT_DMG: "bg-[position:-96px_-72px]",
	PURPLE_SPEED: "bg-[position:-120px_-72px]",
	PURPLE_POTENCY: "bg-[position:-144px_-72px]",
	PURPLE_TENACITY: "bg-[position:-169px_-72px]",
	// Gold tier (X 96px offset)
	GOLD_HEALTH: "bg-[position:-0px_-96px]",
	GOLD_OFFENSE: "bg-[position:-24px_-96px]",
	GOLD_DEFENSE: "bg-[position:-48px_-96px]",
	GOLD_CRIT_CHANCE: "bg-[position:-72px_-96px]",
	GOLD_CRIT_DMG: "bg-[position:-96px_-96px]",
	GOLD_SPEED: "bg-[position:-120px_-96px]",
	GOLD_POTENCY: "bg-[position:-144px_-96px]",
	GOLD_TENACITY: "bg-[position:-169px_-96px]",
	// Fallback
	FALLBACK: "bg-[position:-0px_-0px]",
} as const;

const SLOT_BG_POSITIONS = {
	// Grey tier (0px Y offset)
	GREY_OTHER_SQUARE: "bg-[position:-0px_0px]",
	GREY_OTHER_ARROW: "bg-[position:-70px_0px]",
	GREY_OTHER_DIAMOND: "bg-[position:-140px_0px]",
	GREY_OTHER_TRIANGLE: "bg-[position:-210px_0px]",
	GREY_OTHER_CIRCLE: "bg-[position:-280px_0px]",
	GREY_OTHER_CROSS: "bg-[position:-350px_0px]",
	GREY_6_SQUARE: "bg-[position:-420px_0px]",
	GREY_6_ARROW: "bg-[position:-490px_0px]",
	GREY_6_DIAMOND: "bg-[position:-560px_0px]",
	GREY_6_TRIANGLE: "bg-[position:-630px_0px]",
	GREY_6_CIRCLE: "bg-[position:-700px_0px]",
	GREY_6_CROSS: "bg-[position:-770px_0px]",
	// Green tier (-70px Y offset)
	GREEN_OTHER_SQUARE: "bg-[position:-0px_-70px]",
	GREEN_OTHER_ARROW: "bg-[position:-70px_-70px]",
	GREEN_OTHER_DIAMOND: "bg-[position:-140px_-70px]",
	GREEN_OTHER_TRIANGLE: "bg-[position:-210px_-70px]",
	GREEN_OTHER_CIRCLE: "bg-[position:-280px_-70px]",
	GREEN_OTHER_CROSS: "bg-[position:-350px_-70px]",
	GREEN_6_SQUARE: "bg-[position:-420px_-70px]",
	GREEN_6_ARROW: "bg-[position:-490px_-70px]",
	GREEN_6_DIAMOND: "bg-[position:-560px_-70px]",
	GREEN_6_TRIANGLE: "bg-[position:-630px_-70px]",
	GREEN_6_CIRCLE: "bg-[position:-700px_-70px]",
	GREEN_6_CROSS: "bg-[position:-770px_-70px]",
	// Blue tier (-140px Y offset)
	BLUE_OTHER_SQUARE: "bg-[position:-0px_-140px]",
	BLUE_OTHER_ARROW: "bg-[position:-70px_-140px]",
	BLUE_OTHER_DIAMOND: "bg-[position:-140px_-140px]",
	BLUE_OTHER_TRIANGLE: "bg-[position:-210px_-140px]",
	BLUE_OTHER_CIRCLE: "bg-[position:-280px_-140px]",
	BLUE_OTHER_CROSS: "bg-[position:-350px_-140px]",
	BLUE_6_SQUARE: "bg-[position:-420px_-140px]",
	BLUE_6_ARROW: "bg-[position:-490px_-140px]",
	BLUE_6_DIAMOND: "bg-[position:-560px_-140px]",
	BLUE_6_TRIANGLE: "bg-[position:-630px_-140px]",
	BLUE_6_CIRCLE: "bg-[position:-700px_-140px]",
	BLUE_6_CROSS: "bg-[position:-770px_-140px]",
	// Purple tier (-210px Y offset)
	PURPLE_OTHER_SQUARE: "bg-[position:-0px_-210px]",
	PURPLE_OTHER_ARROW: "bg-[position:-70px_-210px]",
	PURPLE_OTHER_DIAMOND: "bg-[position:-140px_-210px]",
	PURPLE_OTHER_TRIANGLE: "bg-[position:-210px_-210px]",
	PURPLE_OTHER_CIRCLE: "bg-[position:-280px_-210px]",
	PURPLE_OTHER_CROSS: "bg-[position:-350px_-210px]",
	PURPLE_6_SQUARE: "bg-[position:-420px_-210px]",
	PURPLE_6_ARROW: "bg-[position:-490px_-210px]",
	PURPLE_6_DIAMOND: "bg-[position:-560px_-210px]",
	PURPLE_6_TRIANGLE: "bg-[position:-630px_-210px]",
	PURPLE_6_CIRCLE: "bg-[position:-700px_-210px]",
	PURPLE_6_CROSS: "bg-[position:-770px_-210px]",
	// Gold tier (-280px Y offset)
	GOLD_OTHER_SQUARE: "bg-[position:-0px_-280px]",
	GOLD_OTHER_ARROW: "bg-[position:-70px_-280px]",
	GOLD_OTHER_DIAMOND: "bg-[position:-140px_-280px]",
	GOLD_OTHER_TRIANGLE: "bg-[position:-210px_-280px]",
	GOLD_OTHER_CIRCLE: "bg-[position:-280px_-280px]",
	GOLD_OTHER_CROSS: "bg-[position:-350px_-280px]",
	GOLD_6_SQUARE: "bg-[position:-420px_-280px]",
	GOLD_6_ARROW: "bg-[position:-490px_-280px]",
	GOLD_6_DIAMOND: "bg-[position:-560px_-280px]",
	GOLD_6_TRIANGLE: "bg-[position:-630px_-280px]",
	GOLD_6_CIRCLE: "bg-[position:-700px_-280px]",
	GOLD_6_CROSS: "bg-[position:-770px_-280px]",
	// Fallback
	FALLBACK: "bg-[position:0px_0px]",
} as const;

type BackgroundPositionClass =
	(typeof SLOT_BG_POSITIONS)[keyof typeof SLOT_BG_POSITIONS];
type SetBackgroundPositionClass =
	(typeof SET_BG_POSITIONS)[keyof typeof SET_BG_POSITIONS];

type ComponentProps = {
	className?: string;
	mod: Mod;
	showAvatar?: boolean;
};

const ModImage = memo(
	({ className = "", mod, showAvatar = false }: ComponentProps) => {
		const characterById = use$(profilesManagement$.activeProfile.characterById);
		const character = mod.characterID
			? characterById[mod.characterID as CharacterNames]
			: null;

		// #region Slot Match
		const slotBackgroundPosition: BackgroundPositionClass = match([
			mod.pips,
			mod.slot,
			mod.tier,
		])
			.with(
				[6, "square", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_6_SQUARE,
			)
			.with(
				[6, "arrow", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_6_ARROW,
			)
			.with(
				[6, "diamond", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_6_DIAMOND,
			)
			.with(
				[6, "triangle", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_6_TRIANGLE,
			)
			.with(
				[6, "circle", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_6_CIRCLE,
			)
			.with(
				[6, "cross", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_6_CROSS,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "square", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_OTHER_SQUARE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "arrow", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_OTHER_ARROW,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "diamond", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_OTHER_DIAMOND,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "triangle", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_OTHER_TRIANGLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "circle", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_OTHER_CIRCLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "cross", ModTiersEnum.Grey],
				() => SLOT_BG_POSITIONS.GREY_OTHER_CROSS,
			)
			.with(
				[6, "square", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_6_SQUARE,
			)
			.with(
				[6, "arrow", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_6_ARROW,
			)
			.with(
				[6, "diamond", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_6_DIAMOND,
			)
			.with(
				[6, "triangle", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_6_TRIANGLE,
			)
			.with(
				[6, "circle", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_6_CIRCLE,
			)
			.with(
				[6, "cross", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_6_CROSS,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "square", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_OTHER_SQUARE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "arrow", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_OTHER_ARROW,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "diamond", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_OTHER_DIAMOND,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "triangle", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_OTHER_TRIANGLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "circle", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_OTHER_CIRCLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "cross", ModTiersEnum.Green],
				() => SLOT_BG_POSITIONS.GREEN_OTHER_CROSS,
			)
			.with(
				[6, "square", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_6_SQUARE,
			)
			.with(
				[6, "arrow", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_6_ARROW,
			)
			.with(
				[6, "diamond", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_6_DIAMOND,
			)
			.with(
				[6, "triangle", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_6_TRIANGLE,
			)
			.with(
				[6, "circle", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_6_CIRCLE,
			)
			.with(
				[6, "cross", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_6_CROSS,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "square", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_OTHER_SQUARE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "arrow", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_OTHER_ARROW,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "diamond", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_OTHER_DIAMOND,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "triangle", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_OTHER_TRIANGLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "circle", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_OTHER_CIRCLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "cross", ModTiersEnum.Blue],
				() => SLOT_BG_POSITIONS.BLUE_OTHER_CROSS,
			)
			.with(
				[6, "square", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_6_SQUARE,
			)
			.with(
				[6, "arrow", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_6_ARROW,
			)
			.with(
				[6, "diamond", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_6_DIAMOND,
			)
			.with(
				[6, "triangle", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_6_TRIANGLE,
			)
			.with(
				[6, "circle", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_6_CIRCLE,
			)
			.with(
				[6, "cross", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_6_CROSS,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "square", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_OTHER_SQUARE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "arrow", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_OTHER_ARROW,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "diamond", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_OTHER_DIAMOND,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "triangle", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_OTHER_TRIANGLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "circle", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_OTHER_CIRCLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "cross", ModTiersEnum.Purple],
				() => SLOT_BG_POSITIONS.PURPLE_OTHER_CROSS,
			)
			.with(
				[6, "square", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_6_SQUARE,
			)
			.with(
				[6, "arrow", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_6_ARROW,
			)
			.with(
				[6, "diamond", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_6_DIAMOND,
			)
			.with(
				[6, "triangle", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_6_TRIANGLE,
			)
			.with(
				[6, "circle", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_6_CIRCLE,
			)
			.with(
				[6, "cross", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_6_CROSS,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "square", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_OTHER_SQUARE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "arrow", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_OTHER_ARROW,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "diamond", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_OTHER_DIAMOND,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "triangle", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_OTHER_TRIANGLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "circle", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_OTHER_CIRCLE,
			)
			.with(
				[P.union(1, 2, 3, 4, 5), "cross", ModTiersEnum.Gold],
				() => SLOT_BG_POSITIONS.GOLD_OTHER_CROSS,
			)
			.otherwise(() => {
				console.warn("Unmatched mod combination:", {
					pips: mod.pips,
					slot: mod.slot,
					tier: mod.tier,
				});
				return SLOT_BG_POSITIONS.FALLBACK;
			});
		// #endregion

		// #region Set Match
		const setBackgroundPosition: SetBackgroundPositionClass = match([
			mod.modset,
			mod.tier,
		])
			.with(["Health %", ModTiersEnum.Grey], () => SET_BG_POSITIONS.GREY_HEALTH)
			.with(
				["Offense %", ModTiersEnum.Grey],
				() => SET_BG_POSITIONS.GREY_OFFENSE,
			)
			.with(
				["Defense %", ModTiersEnum.Grey],
				() => SET_BG_POSITIONS.GREY_DEFENSE,
			)
			.with(
				["Critical Chance %", ModTiersEnum.Grey],
				() => SET_BG_POSITIONS.GREY_CRIT_CHANCE,
			)
			.with(
				["Critical Damage %", ModTiersEnum.Grey],
				() => SET_BG_POSITIONS.GREY_CRIT_DMG,
			)
			.with(["Speed %", ModTiersEnum.Grey], () => SET_BG_POSITIONS.GREY_SPEED)
			.with(
				["Potency %", ModTiersEnum.Grey],
				() => SET_BG_POSITIONS.GREY_POTENCY,
			)
			.with(
				["Tenacity %", ModTiersEnum.Grey],
				() => SET_BG_POSITIONS.GREY_TENACITY,
			)
			.with(
				["Health %", ModTiersEnum.Green],
				() => SET_BG_POSITIONS.GREEN_HEALTH,
			)
			.with(
				["Offense %", ModTiersEnum.Green],
				() => SET_BG_POSITIONS.GREEN_OFFENSE,
			)
			.with(
				["Defense %", ModTiersEnum.Green],
				() => SET_BG_POSITIONS.GREEN_DEFENSE,
			)
			.with(
				["Critical Chance %", ModTiersEnum.Green],
				() => SET_BG_POSITIONS.GREEN_CRIT_CHANCE,
			)
			.with(
				["Critical Damage %", ModTiersEnum.Green],
				() => SET_BG_POSITIONS.GREEN_CRIT_DMG,
			)
			.with(["Speed %", ModTiersEnum.Green], () => SET_BG_POSITIONS.GREEN_SPEED)
			.with(
				["Potency %", ModTiersEnum.Green],
				() => SET_BG_POSITIONS.GREEN_POTENCY,
			)
			.with(
				["Tenacity %", ModTiersEnum.Green],
				() => SET_BG_POSITIONS.GREEN_TENACITY,
			)
			.with(["Health %", ModTiersEnum.Blue], () => SET_BG_POSITIONS.BLUE_HEALTH)
			.with(
				["Offense %", ModTiersEnum.Blue],
				() => SET_BG_POSITIONS.BLUE_OFFENSE,
			)
			.with(
				["Defense %", ModTiersEnum.Blue],
				() => SET_BG_POSITIONS.BLUE_DEFENSE,
			)
			.with(
				["Critical Chance %", ModTiersEnum.Blue],
				() => SET_BG_POSITIONS.BLUE_CRIT_CHANCE,
			)
			.with(
				["Critical Damage %", ModTiersEnum.Blue],
				() => SET_BG_POSITIONS.BLUE_CRIT_DMG,
			)
			.with(["Speed %", ModTiersEnum.Blue], () => SET_BG_POSITIONS.BLUE_SPEED)
			.with(
				["Potency %", ModTiersEnum.Blue],
				() => SET_BG_POSITIONS.BLUE_POTENCY,
			)
			.with(
				["Tenacity %", ModTiersEnum.Blue],
				() => SET_BG_POSITIONS.BLUE_TENACITY,
			)
			.with(
				["Health %", ModTiersEnum.Purple],
				() => SET_BG_POSITIONS.PURPLE_HEALTH,
			)
			.with(
				["Offense %", ModTiersEnum.Purple],
				() => SET_BG_POSITIONS.PURPLE_OFFENSE,
			)
			.with(
				["Defense %", ModTiersEnum.Purple],
				() => SET_BG_POSITIONS.PURPLE_DEFENSE,
			)
			.with(
				["Critical Chance %", ModTiersEnum.Purple],
				() => SET_BG_POSITIONS.PURPLE_CRIT_CHANCE,
			)
			.with(
				["Critical Damage %", ModTiersEnum.Purple],
				() => SET_BG_POSITIONS.PURPLE_CRIT_DMG,
			)
			.with(
				["Speed %", ModTiersEnum.Purple],
				() => SET_BG_POSITIONS.PURPLE_SPEED,
			)
			.with(
				["Potency %", ModTiersEnum.Purple],
				() => SET_BG_POSITIONS.PURPLE_POTENCY,
			)
			.with(
				["Tenacity %", ModTiersEnum.Purple],
				() => SET_BG_POSITIONS.PURPLE_TENACITY,
			)
			.with(["Health %", ModTiersEnum.Gold], () => SET_BG_POSITIONS.GOLD_HEALTH)
			.with(
				["Offense %", ModTiersEnum.Gold],
				() => SET_BG_POSITIONS.GOLD_OFFENSE,
			)
			.with(
				["Defense %", ModTiersEnum.Gold],
				() => SET_BG_POSITIONS.GOLD_DEFENSE,
			)
			.with(
				["Critical Chance %", ModTiersEnum.Gold],
				() => SET_BG_POSITIONS.GOLD_CRIT_CHANCE,
			)
			.with(
				["Critical Damage %", ModTiersEnum.Gold],
				() => SET_BG_POSITIONS.GOLD_CRIT_DMG,
			)
			.with(["Speed %", ModTiersEnum.Gold], () => SET_BG_POSITIONS.GOLD_SPEED)
			.with(
				["Potency %", ModTiersEnum.Gold],
				() => SET_BG_POSITIONS.GOLD_POTENCY,
			)
			.with(
				["Tenacity %", ModTiersEnum.Gold],
				() => SET_BG_POSITIONS.GOLD_TENACITY,
			)
			.otherwise(() => {
				console.warn("Unmatched modset tier combination:", {
					modset: mod.modset,
					tier: mod.tier,
				});
				return SET_BG_POSITIONS.FALLBACK;
			});
		// #endregion Slot Match

		const setPosition = match(mod.slot)
			.with("square", () => "left-29px top-17px")
			.with("arrow", () => "left-32px top-16px")
			.with("diamond", () => "left-23px top-23px")
			.with("triangle", () => "left-23px top-27px")
			.with("circle", () => "left-23px top-23px")
			.with("cross", () => "left-23px top-23px")
			.exhaustive();

		return (
			<div
				className={cn("group relative flex flex-col items-center", className)}
			>
				<Pips pips={mod.pips} />
				<div
					className={`relative size-17.5 bg-[url(/img/mod-shape-atlas.webp)] group-[&.no-move]:bg-[url(/img/mod-shape-atlas-faded.webp)] bg-size-[840px_350px] ${slotBackgroundPosition}`}
				>
					<Badge
						className={`h-5 min-w-5 px-1 bg-black absolute top-0 left-0 rounded-sm font-mono ${15 === mod.level ? "text-mod-gold " : "text-mod-grey "} tabular-nums`}
					>
						{mod.level}
					</Badge>
					<Badge
						className={`bg-[url(/img/mod-icon-atlas.webp)] group-[&.no-move]:bg-[url(/img/mod-icon-atlas-faded.webp)] bg-size-[192px_120px] size-6 absolute ${setPosition} text-base ${setBackgroundPosition} border-none`}
						variant="outline"
					/>
				</div>
				{showAvatar && character && (
					<CharacterAvatar
						character={character}
						displayStars={false}
						displayGear={false}
						displayLevel={false}
						className={"absolute bottom-[-0.5em] right-[-1em] size-8 m-b-0"}
					/>
				)}
			</div>
		);
	},
);

ModImage.displayName = "ModImage";

export default ModImage;
