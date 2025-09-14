// react
import { lazy, memo } from "react";
import { useTranslation } from "react-i18next";

// styles
import "./ModStats.css";

// state
import { use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const optimizationSettings$ = stateLoader$.optimizationSettings$;
const characters$ = stateLoader$.characters$;

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

import type * as Character from "#/domain/Character";
import type { Mod } from "#/domain/Mod";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { SecondaryStats, Stats } from "#/domain/Stats";

// components
const CharacterAvatar = lazy(
	() => import("../CharacterAvatar/CharacterAvatar"),
);
const ModScores = lazy(() => import("../ModScores/ModScores"));
const SellModButton = lazy(() => import("../SellModButton/SellModButton"));

type ComponentProps = {
	mod: Mod;
	showAvatar?: boolean;
	assignedTarget?: OptimizationPlan;
};

const ModStats = memo(
	({ mod, showAvatar = false, assignedTarget }: ComponentProps) => {
		const [t, i18n] = useTranslation("domain");
		const characterById = use$(profilesManagement$.activeProfile.characterById);
		const baseCharacterById = use$(characters$.baseCharacterById);

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
			speedRemainder: string,
		) => {
			const displayStat = `${translateStat(stat.show())} ${speedRemainder}`;
			return (
				<li key={index} className={`class-${stat.getClass()}`}>
					<span className={"rolls"}>({stat.rolls})</span> {displayStat}
				</li>
			);
		};

		const character: Character.Character | null =
			mod.characterID !== null
				? characterById[mod.characterID as CharacterNames]
				: null;
		const statsDisplay =
			mod.secondaryStats.length > 0
				? mod.secondaryStats.map((stat, index) => {
					let speedRemainder = "";
					if (stat.type === "Speed" && mod.speedRemainder !== undefined) {
						speedRemainder = ` R${mod.speedRemainder}`;
					}
					return showStatElement(stat, index, speedRemainder)
				})
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
