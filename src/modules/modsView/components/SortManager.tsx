// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import type { Observable } from "@legendapp/state";
import { For, observer, useValue } from "@legendapp/state/react";

import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const modsView$ = stateLoader$.modsView$;

// domain
import { SecondaryStats } from "#/domain/Stats";
import { modScorers } from "#/modules/modScores/domain/ModScorer";
import type { SortConfig } from "../domain/SortConfig";

// components
import { ChevronDown } from "lucide-react";
import { ReactiveMultiColumnSelect } from "#/components/reactive/ReactiveMultiColumnSelect";
import { Badge } from "#ui/badge";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

interface SortItemProps {
	item$: Observable<SortConfig>;
}

function SortItem({ item$: sortConfig$ }: SortItemProps) {
	const [t] = useTranslation("domain");
	const sortConfig = useValue(sortConfig$);

	const sortOptions = [
		{
			label: "misc",
			items: [
				{ value: "characterID", label: "CharacterId (default)" },
				{ value: "speedRemainder", label: "Speed Remainder" },
				{ value: "slot", label: "Slot" },
				{ value: "modset", label: "Set" },
				{ value: "rolls", label: "# of Stat Upgrades" },
				{ value: "character", label: "Character" },
				{ value: "reRolledCount", label: "Calibrations" },
				{ value: "TotalCalibrations", label: "Total Calibrations" },
			],
		},
		{
			label: "Stats",
			items: SecondaryStats.SecondaryStat.statNames.map((stat) => ({
				value: `Stat${stat}`,
				label: t(`stats.${stat}`),
			})),
		},
		{
			label: "Stat Scores",
			items: SecondaryStats.SecondaryStat.statNames.map((stat) => ({
				value: `StatScore${stat}`,
				label: t(`stats.${stat}`),
			})),
		},
		{
			label: "Mod Scores",
			items: Array.from(modScorers.values()).map((modScorer) => ({
				value: `ModScore${modScorer.name}`,
				label: modScorer.displayName,
			})),
		},
	];

	return (
		<Badge variant={"outline"} className={"flex items-center"}>
			<ReactiveMultiColumnSelect
				key={`sort-option-${sortConfig.id}`}
				groups={sortOptions}
				$value={sortConfig$.sortBy}
			/>
			<Button
				size={"icon-xs"}
				variant={"outline"}
				className="h-4 p-0 aspect-square"
				onClick={() => {
					if (sortConfig$.sortOrder.peek() === "asc") {
						sortConfig$.sortOrder.set("desc");
					} else {
						sortConfig$.sortOrder.set("asc");
					}
				}}
			>
				<ChevronDown
					className={`m-r0 h-4 w-4 ${sortConfig.sortOrder === "asc" ? "transform rotate-180 transition-transform duration-300" : ""}`}
				/>
			</Button>
			<Button
				size={"icon-xs"}
				className="h-4 p-0 aspect-square"
				variant={"outline"}
				onClick={() =>
					modsView$.activeViewSetupInActiveCategory.sort.delete(
						sortConfig$.id.peek(),
					)
				}
			>
				x
			</Button>
		</Badge>
	);
}

const SortManager = observer(
	React.memo(() => {
		const _viewSetup = useValue(modsView$.activeViewSetupInActiveCategory);

		return (
			<div className={"flex flex-col justify-between items-center gap-2"}>
				<div>
					<Label htmlFor={"sort-option-1"}>Sort by: </Label>
					<Button
						size={"xs"}
						variant={"outline"}
						onClick={() => modsView$.addSortConfig()}
					>
						+
					</Button>
				</div>
				<div className="flex justify-around flex-wrap gap-2">
					<For
						each={modsView$.activeViewSetupInActiveCategory.sort}
						item={SortItem}
						optimized
					/>
				</div>
			</div>
		);
	}),
);

SortManager.displayName = "SortManager";

export default SortManager;
