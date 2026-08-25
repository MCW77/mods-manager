// components
import { ModsetsCard } from "../components/ModsetsCard";
import { OffenseDefenseCard } from "../components/OffenseDefenseCard";
import { SpeedCard } from "../components/SpeedCard";

function StatisticsView() {
	return (
		<div className="flex gap-4 p-4 w-full items-start">
			<SpeedCard />
			<OffenseDefenseCard />
			<ModsetsCard />
		</div>
	);
}

export default StatisticsView;
