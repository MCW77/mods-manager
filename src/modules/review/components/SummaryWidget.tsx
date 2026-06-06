// utils
import { formatNumber } from "#/utils/formatNumber";

// react
import { useTranslation } from "react-i18next";

// components
import { Credits } from "#/components/Credits/Credits";

type ComponentProps = {
	currentSetValue: number;
	newSetValue: number;
	modRemovalCost: number;
	modUpgradeCost: number;
	numMovingMods: number;
};

const SummaryWidget = ({
	currentSetValue,
	newSetValue,
	modRemovalCost,
	modUpgradeCost,
	numMovingMods,
}: ComponentProps) => {
	const [t] = useTranslation("optimize-ui");
	const valueChange = (100 * (newSetValue - currentSetValue)) / currentSetValue;

	return (
		<div className="flex gap-4 flex-wrap">
			<div className="prose prose-sm dark:prose-invert text-sm">
				<h4>{t("review.summary.Costs")}</h4>
				<p>
					<span>
						{t("review.summary.ReassignedX", { count: numMovingMods })}
					</span>
					<br />
					<span>
						{t("review.summary.MoveCost")} {formatNumber(modRemovalCost)}{" "}
						<Credits />
					</span>
					<br />
					<span>
						{t("review.summary.LevelUpCost")} {formatNumber(modUpgradeCost)}{" "}
						<Credits />
					</span>
				</p>
			</div>
			<div className="prose prose-sm dark:prose-invert text-sm">
				<h4>{t("review.summary.Scores")}</h4>
				<p>
					<span>
						{t("review.summary.AllOld")}:{" "}
						{formatNumber(Number(currentSetValue.toFixed(2)))}
					</span>
					<br />
					<span>
						{t("review.summary.AllNew")}:{" "}
						{formatNumber(Number(newSetValue.toFixed(2)))}
					</span>
					<br />
					<span>
						{t("review.summary.AllChange")}:{" "}
						<span
							className={
								valueChange > 0
									? "text-green-500 after:content-['+']"
									: valueChange < 0
										? "text-red-500"
										: ""
							}
						>
							{formatNumber(Number(valueChange.toFixed(2)))}%
						</span>
					</span>
				</p>
			</div>
		</div>
	);
};

SummaryWidget.displayName = "SummaryWidget";

export { SummaryWidget };
