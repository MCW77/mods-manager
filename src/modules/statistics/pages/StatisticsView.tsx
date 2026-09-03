// components
import { MissingModsOfSlots } from "../components/MissingModsOfSlots";
import { ModQualityCard } from "../components/ModQualityCard";
import { ModsetsCard } from "../components/ModsetsCard";
import { ModSlots } from "../components/ModSlots";
import { ModsToFarm } from "../components/ModsToFarm";
import { OffenseDefenseCard } from "../components/OffenseDefenseCard";
import { SpeedCard } from "../components/SpeedCard";
import { ScrollArea } from "#ui/scroll-area";

function StatisticsView() {
	return (
		<ScrollArea>
			<div className="flex flex-wrap gap-4 p-4 w-full items-start">
				<SpeedCard />
				<div className="flex flex-col gap-4">
					<OffenseDefenseCard />
					<ModQualityCard />
				</div>
				<ModsetsCard />
				<ModSlots />
				<ModsToFarm />
				<MissingModsOfSlots />
			</div>
		</ScrollArea>
	);
}

export default StatisticsView;
