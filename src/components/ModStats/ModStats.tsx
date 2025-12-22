// react
import { memo } from "react";
import { useTranslation } from "react-i18next";

// types
import type { TFunction } from "i18next";

// state
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const optimizationSettings$ = stateLoader$.optimizationSettings$;

// domain
import type { Mod } from "#/domain/Mod";
import { modTierColors } from "#/domain/ModTierColors";
import type { OptimizationPlan } from "#/domain/OptimizationPlan";
import type { SecondaryStats, Stats } from "#/domain/Stats";

// components
import ModScores from "../ModScores/ModScores";

const translateStat = (
	displayText: Stats.DisplayedStat,
	t: TFunction<"domain", undefined>,
) => {
	const seperatorPos = displayText.indexOf(" ");
	const statValue = displayText.substring(0, seperatorPos);
	const statName: Stats.DisplayStatNames = displayText.substring(
		seperatorPos + 1,
	) as Stats.DisplayStatNames;
	const translatedStatName = t(`stats.${statName}`);
	const parts = [statValue, translatedStatName];

	return parts.join(" ");
};

type ComponentProps = {
	mod: Mod;
	assignedTarget?: OptimizationPlan;
};

const ModStats = memo(({ mod, assignedTarget }: ComponentProps) => {
	const [t] = useTranslation("domain");

	const showStatElement = (
		stat: SecondaryStats.SecondaryStat,
		index: number,
		speedRemainder: string,
	) => {
		const displayStat = `${translateStat(stat.show(), t)} ${speedRemainder}`;
		return (
			<li
				key={index}
				className={`leading-[1.2em] ${modTierColors[stat.getClass()]}`}
			>
				<span>({stat.rolls})</span> {displayStat}
			</li>
		);
	};

	const statsDisplay =
		mod.secondaryStats.length > 0
			? mod.secondaryStats.map((stat, index) => {
					let speedRemainder = "";
					if (stat.type === "Speed" && mod.speedRemainder !== undefined) {
						speedRemainder = ` R${mod.speedRemainder}`;
					}
					return showStatElement(stat, index, speedRemainder);
				})
			: [<li key={0}>None</li>];

	return (
		<div className="text-left">
			<h4 className="uppercase">{t("Primary")}</h4>
			<ul className="m-b-[0.5em]">
				<li className={"leading-[1.2em]"}>
					{translateStat(mod.primaryStat.show(), t)}
				</li>
			</ul>
			<div className="flex justify-between">
				<div>
					<h4 className="uppercase">{t("Secondary_other")}</h4>
					<ul className="m-b-[0.5em]">{statsDisplay}</ul>
					{assignedTarget &&
						optimizationSettings$.shouldLevelMod(mod, assignedTarget) && (
							<h4 className={"text-mod-gold"}>Level mod to 15!</h4>
						)}
					{assignedTarget &&
						optimizationSettings$.shouldSliceMod(mod, assignedTarget) && (
							<h4 className={"text-mod-gold"}>Slice mod to 6E!</h4>
						)}{" "}
				</div>
				<ModScores mod={mod} />
			</div>
		</div>
	);
});

ModStats.displayName = "ModStats";

export default ModStats;
