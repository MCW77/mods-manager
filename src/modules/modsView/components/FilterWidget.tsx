// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { useValue } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader.js");

const profilesManagement$ = stateLoader$.profilesManagement$;
const modsView$ = stateLoader$.modsView$;

// components
import { ChevronsUpDown } from "lucide-react";
const FilterManager = lazy(() => import("./FilterManager.jsx"));
const LevelFilter = lazy(() => import("./Filters/LevelFilter.jsx"));
const SlotFilter = lazy(() => import("./Filters/SlotFilter.jsx"));
const SetFilter = lazy(() => import("./Filters/SetFilter.jsx"));
const TierFilter = lazy(() => import("./Filters/TierFilter.jsx"));
const ScoreFilter = lazy(() => import("./Filters/ScoreFilter.jsx"));
const RarityFilter = lazy(() => import("./Filters/RarityFilter.jsx"));
const EquippedFilter = lazy(() => import("./Filters/EquippedFilter.jsx"));
const PrimaryFilter = lazy(() => import("./Filters/PrimaryFilter.jsx"));
const SecondaryFilter = lazy(() => import("./Filters/SecondaryFilter.jsx"));
const AssignedFilter = lazy(() => import("./Filters/AssignedFilter.jsx"));
const CalibrationFilter = lazy(() => import("./Filters/CalibrationFilter.jsx"));
const SpeedFilter = lazy(() => import("./Filters/SpeedFilter.jsx"));

import { Button } from "#/components/ui/button.jsx";
import {
	CollapsibleCard,
	CollapsibleCardContent,
	CollapsibleCardHeader,
	CollapsibleCardTitle,
	CollapsibleCardTrigger,
} from "#ui/CollapsibleCard.jsx";

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
