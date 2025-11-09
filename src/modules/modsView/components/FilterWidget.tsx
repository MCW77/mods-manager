// react
import { lazy } from "react";
import { useTranslation } from "react-i18next";

// state
import { use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const modsView$ = stateLoader$.modsView$;

// components
import { ChevronsUpDown } from "lucide-react";
const FilterManager = lazy(() => import("./FilterManager"));
const LevelFilter = lazy(() => import("./Filters/LevelFilter"));
const SlotFilter = lazy(() => import("./Filters/SlotFilter"));
const SetFilter = lazy(() => import("./Filters/SetFilter"));
const TierFilter = lazy(() => import("./Filters/TierFilter"));
const ScoreFilter = lazy(() => import("./Filters/ScoreFilter"));
const RarityFilter = lazy(() => import("./Filters/RarityFilter"));
const EquippedFilter = lazy(() => import("./Filters/EquippedFilter"));
const PrimaryFilter = lazy(() => import("./Filters/PrimaryFilter"));
const SecondaryFilter = lazy(() => import("./Filters/SecondaryFilter"));
const AssignedFilter = lazy(() => import("./Filters/AssignedFilter"));
const CalibrationFilter = lazy(() => import("./Filters/CalibrationFilter"));
const SpeedFilter = lazy(() => import("./Filters/SpeedFilter"));

import { Button } from "#/components/ui/button";
import {
	CollapsibleCard,
	CollapsibleCardContent,
	CollapsibleCardHeader,
	CollapsibleCardTitle,
	CollapsibleCardTrigger,
} from "#ui/CollapsibleCard";

const FilterWidget = () => {
	const [t] = useTranslation("explore-ui");
	const _profile = use$(profilesManagement$.activeProfile);

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
