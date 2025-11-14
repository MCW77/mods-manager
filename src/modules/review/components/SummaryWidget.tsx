// utils
import { formatNumber } from "#/utils/formatNumber.js";

// components
import { Credits } from "#/components/Credits/Credits.jsx";

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
	const valueChange = (100 * (newSetValue - currentSetValue)) / currentSetValue;

	return (
		<div className="prose prose-sm dark:prose-invert text-sm">
			<h4>Costs</h4>
			<p>
				<span>Reassigning {numMovingMods} mods</span>
				<br />
				<span>
					Your mods will cost {formatNumber(modRemovalCost)} <Credits /> to
					move,
				</span>
				<br />
				<span>
					and an additional {formatNumber(modUpgradeCost)} <Credits /> to level
					up to 15.
				</span>
			</p>
			<h4>Set Value</h4>
			<p>
				<span>
					Old set value sum: {formatNumber(Number(currentSetValue.toFixed(2)))}
				</span>
				<br />
				<span>
					New set value sum: {formatNumber(Number(newSetValue.toFixed(2)))}
				</span>
				<br />
				<span>
					Overall change:{" "}
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
	);
};

SummaryWidget.displayName = "SummaryWidget";

export { SummaryWidget };
