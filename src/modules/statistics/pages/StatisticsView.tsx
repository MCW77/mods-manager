// components
import { OffenseDefenseCard } from "../components/OffenseDefenseCard";
import { SpeedCard } from "../components/SpeedCard";

function StatisticsView() {
	return (
		<div className="flex gap-4 p-4 w-full items-start">
			<SpeedCard />
			<OffenseDefenseCard />
		</div>
	);
}

export default StatisticsView;
