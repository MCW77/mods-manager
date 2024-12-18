// react
import React, { lazy } from "react";
import { useTranslation } from "react-i18next";

// styles
import "./ModStats.css";

// state
const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;
const characters$ = stateLoader$.characters$;
const modsView$ = stateLoader$.modsView$;

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type * as Character from "#/domain/Character";
import { type Mod, modScores } from "#/domain/Mod";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { SecondaryStats, Stats } from "#/domain/Stats";

// components
const CharacterAvatar = lazy(
	() => import("../CharacterAvatar/CharacterAvatar"),
);
const ModScores = lazy(() => import("../ModScores/ModScores"));
const SellModButton = lazy(() => import("../SellModButton/SellModButton"));
import { Separator } from "#ui/separator";

type ComponentProps = {
	mod: Mod;
	showAvatar?: boolean;
	assignedTarget?: OptimizationPlan;
};

const ModStats = React.memo(
	({ mod, showAvatar = false, assignedTarget }: ComponentProps) => {
		const [t, i18n] = useTranslation("domain");
		const characterById = profilesManagement$.activeProfile.characterById.get();
		const baseCharacterById = characters$.baseCharacterById.get();
		const scoreName = modsView$.activeViewSetupInActiveCategory.modScore.get();

		const translateStat = (displayText: Stats.DisplayedStat) => {
			const seperatorPos = displayText.indexOf(" ");
			const statValue = displayText.substring(0, seperatorPos);
			const statName: Stats.DisplayStatNames = displayText.substring(
				seperatorPos + 1,
			) as Stats.DisplayStatNames;
			const translatedStatName = t(`stats.${statName}`);
			const parts = [statValue, translatedStatName];

			return parts.join(" ");
		};

		const showStatElement = (
			stat: SecondaryStats.SecondaryStat,
			index: number,
		) => {
			const displayStat = translateStat(stat.show());
			return (
				<li key={index} className={`class-${stat.getClass()}`}>
					<span className={"rolls"}>({stat.rolls})</span> {displayStat}
				</li>
			);
		};

		const showStatScoreElement = (
			stat: SecondaryStats.SecondaryStat,
			index: number,
		) => {
			if (!("score" in stat) || stat.score === undefined)
				return <li key={index}>{"--"}</li>;

			return (
				<li key={index} className={`class-${stat.score.getClass()}`}>
					{stat.score.show()}
				</li>
			);
		};

		const showAllStatsScoreElement = (mod: Mod, scoreName: string) => {
			return (
				<li key={5} className={`class-${mod.getClass()}`}>
					{modScores.find((modScore) => modScore.name === scoreName)
						?.isFlatOrPercentage === "IsFlat"
						? `${mod.scores[scoreName]}`
						: `${Math.floor(mod.scores[scoreName] * 100) / 100}%`}
				</li>
			);
		};

		const character: Character.Character | null =
			mod.characterID !== null
				? characterById[mod.characterID as CharacterNames]
				: null;
		const statsDisplay =
			mod.secondaryStats.length > 0
				? mod.secondaryStats.map((stat, index) => showStatElement(stat, index))
				: [<li key={0}>None</li>];

		const statsScoresDisplay =
			mod.secondaryStats.length > 0
				? mod.secondaryStats.map((stat, index) =>
						showStatScoreElement(stat, index),
					)
				: [<li key={0}>None</li>];

		const allStatsScoreDisplay =
			mod.secondaryStats.length > 0
				? showAllStatsScoreElement(mod, scoreName)
				: [<li key={0}>None</li>];

		return (
			<div className="mod-stats">
				<h4>{t("Primary")}</h4>
				<ul>
					<li>{translateStat(mod.primaryStat.show())}</li>
				</ul>
				<div className="secondaries-scores-container">
					<div>
						<h4>{t("Secondary_other")}</h4>
						<ul className="secondary">{statsDisplay}</ul>
					</div>
					<ModScores mod={mod} />
				</div>
				{showAvatar && character && (
					<div className={"assigned-character"}>
						<h4>Assigned To</h4>
						<CharacterAvatar character={character} />
						<span className="avatar-name">
							{baseCharacterById[character.id]
								? baseCharacterById[character.id].name
								: character.id}
						</span>
					</div>
				)}
				{showAvatar && <SellModButton mod={mod} />}
				{assignedTarget &&
					optimizationSettings$.shouldLevelMod(mod, assignedTarget) && (
						<h4 className={"gold"}>Level mod to 15!</h4>
					)}
				{assignedTarget &&
					optimizationSettings$.shouldSliceMod(mod, assignedTarget) && (
						<h4 className={"gold"}>Slice mod to 6E!</h4>
					)}
			</div>
		);
	},
);

ModStats.displayName = "ModStats";

export default ModStats;
