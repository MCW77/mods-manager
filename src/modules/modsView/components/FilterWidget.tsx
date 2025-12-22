// react
import { useTranslation } from "react-i18next";

// state
import { useValue } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const profilesManagement$ = stateLoader$.profilesManagement$;
const modsView$ = stateLoader$.modsView$;

// components
import { ChevronsUpDown } from "lucide-react";
import FilterManager from "./FilterManager";
import LevelFilter from "./Filters/LevelFilter";
import SlotFilter from "./Filters/SlotFilter";
import SetFilter from "./Filters/SetFilter";
import TierFilter from "./Filters/TierFilter";
import ScoreFilter from "./Filters/ScoreFilter";
import RarityFilter from "./Filters/RarityFilter";
import EquippedFilter from "./Filters/EquippedFilter";
import PrimaryFilter from "./Filters/PrimaryFilter";
import SecondaryFilter from "./Filters/SecondaryFilter";
import AssignedFilter from "./Filters/AssignedFilter";
import CalibrationFilter from "./Filters/CalibrationFilter";
import SpeedFilter from "./Filters/SpeedFilter";

import { Button } from "#/components/ui/button";
import {
	CollapsibleCard,
	CollapsibleCardContent,
	CollapsibleCardHeader,
	CollapsibleCardTitle,
	CollapsibleCardTrigger,
} from "#/components/custom/CollapsibleCard";

const FilterWidget = () => {
	const [t] = useTranslation("explore-ui");
	const _profile = useValue(profilesManagement$.activeProfile);

	return (
		<CollapsibleCard
			defaultOpen={true}
			className={
				"flex flex-col justify-between items-center gap-2 w-[-webkit-fill-available]"
			}
		>
			<CollapsibleCardHeader className={"w-full p-2"}>
				<div className={"flex items-center justify-around w-full"}>
					<CollapsibleCardTitle className={"w-[90%]"}>
						Filter:
					</CollapsibleCardTitle>
					<CollapsibleCardTrigger asChild>
						<Button variant="ghost" size="sm" className="w-9 p-0">
							<ChevronsUpDown className="h-4 w-4" />
							<span className="sr-only">Toggle</span>
						</Button>
					</CollapsibleCardTrigger>
				</div>
				<div className={"flex justify-center gap-2"}>
					<FilterManager />
					<Button
						size="xs"
						type={"button"}
						onClick={() => modsView$.resetActiveFilter()}
					>
						{t("filter.Reset")}
					</Button>
				</div>
			</CollapsibleCardHeader>
			<CollapsibleCardContent className={"w-auto"}>
				<div className={"flex flex-col justify-between items-center gap-2"}>
					<div
						className={
							"w-full grid grid-cols-[repeat(auto-fit,_minmax(min(6rem,_100%),_1fr))] gap-x-2 gap-y-4 justify-items-center"
						}
					>
						<SlotFilter />
						<SetFilter />
						<div className="flex flex-col gap-4">
							<LevelFilter />
							<AssignedFilter />
						</div>
						<div className="flex flex-col gap-4">
							<TierFilter />
							<EquippedFilter />
						</div>
						<RarityFilter />
						<CalibrationFilter />
						<div className="flex flex-col gap-4 col-span-2">
							<SpeedFilter />
							<ScoreFilter />
						</div>
					</div>
					<PrimaryFilter />
					<SecondaryFilter />
				</div>
			</CollapsibleCardContent>
		</CollapsibleCard>
	);
};

FilterWidget.displayName = "FilterWidget";

export default FilterWidget;
