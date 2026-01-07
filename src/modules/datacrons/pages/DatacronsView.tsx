// react
import { useState } from "react";
import { useValue } from "@legendapp/state/react";

// state
import { datacrons$ } from "../state/datacrons";

// components
import { Filter, Info } from "lucide-react";
import { Button } from "#ui/button";
import DatacronsList from "../components/DatacronsList";
import FilterCard from "../components/FilterCard";
import MaterialsCard from "../components/MaterialsCard";

export default function DatacronsView() {
	const [showFilters, setShowFilters] = useState(false);
	const [showInfo, setShowInfo] = useState(false);
	const showDescriptionText = useValue(() =>
		datacrons$.showShortDescription.get()
			? "Show Long Descriptions"
			: "Show Short Descriptions",
	);

	return (
		<div className="relative flex h-full w-full flex-col overflow-hidden">
			<div className="flex shrink-0 items-center justify-around border-b px-6 py-4">
				<Button
					variant={"outline"}
					onClick={() => setShowFilters(!showFilters)}
				>
					<Filter className="mr-2 h-4 w-4" />
					{showFilters ? "Hide" : "Show"} Filters
				</Button>
				<Button
					variant={"outline"}
					onClick={() => datacrons$.showShortDescription.toggle()}
				>
					{showDescriptionText}
				</Button>
				<Button variant={"outline"} onClick={() => setShowInfo(!showInfo)}>
					<Info className="mr-2 h-4 w-4" />
					{showInfo ? "Hide" : "Show"} Materials Info
				</Button>
			</div>

			<div className="flex min-h-0 flex-1 flex-col">
				<div className="flex shrink-0 flex-wrap gap-4 p-4">
					<FilterCard showFilters={showFilters} />
					<MaterialsCard showInfo={showInfo} />
				</div>
				<DatacronsList />
			</div>
		</div>
	);
}
