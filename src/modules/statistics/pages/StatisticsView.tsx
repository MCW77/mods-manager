// components
import { ModQualityCard } from "../components/ModQualityCard";
import { ModsetsCard } from "../components/ModsetsCard";
import { ModSlots } from "../components/ModSlots";
import { OffenseDefenseCard } from "../components/OffenseDefenseCard";
import { SpeedCard } from "../components/SpeedCard";

function StatisticsView() {
	return (
		<div className="flex gap-4 p-4 w-full items-start">
			<SpeedCard />
			<div className="flex flex-col gap-4">
				<OffenseDefenseCard />
				<ModQualityCard />
			</div>
			<ModsetsCard />
			<ModSlots />
		</div>
	);
}

export default StatisticsView;
