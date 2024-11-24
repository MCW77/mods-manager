// react
import type React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const profilesManagement$ = stateLoader$.profilesManagement$;
const modsView$ = stateLoader$.modsView$;

// components
import { ChevronsUpDown } from "lucide-react";
import { FilterManager } from "./FilterManager";
import { LevelFilter } from "./Filters/LevelFilter";
import { PrimaryFilter } from "./Filters/PrimaryFilter";
import { RarityFilter } from "./Filters/RarityFilter";
import { SecondaryFilter } from "./Filters/SecondaryFilter";
import { SetFilter } from "./Filters/SetFilter";
import { SlotFilter } from "./Filters/SlotFilter";
import { TierFilter } from "./Filters/TierFilter";
import { Button } from "#ui/button";
import { AssignedFilter } from "./Filters/AssignedFilter";
import { EquippedFilter } from "./Filters/EquippedFilter";
import {
	CollapsibleCard,
	CollapsibleCardContent,
	CollapsibleCardHeader,
	CollapsibleCardTitle,
	CollapsibleCardTrigger,
} from "#ui/CollapsibleCard";

const FilterWidget: React.FC = observer(() => {
	const [t] = useTranslation("explore-ui");
	const profile = profilesManagement$.activeProfile.get();

	return (
		<CollapsibleCard
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
							"w-full grid grid-cols-[repeat(auto-fit,_minmax(min(6rem,_100%),_1fr))] gap-x-2 gap-y-4"
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
					</div>
					<PrimaryFilter />
					<SecondaryFilter />
				</div>
			</CollapsibleCardContent>
		</CollapsibleCard>
	);
});

FilterWidget.displayName = "FilterWidget";

export { FilterWidget };
