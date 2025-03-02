// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { Computed, For, observer, Show, use$ } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const modsView$ = stateLoader$.modsView$;

// domain
import { modScores } from "#/domain/Mod";
import { SecondaryStats } from "#/domain/Stats";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { ReactiveMultiColumnSelect } from "#/components/ReactiveMultiColumnSelect";
import { Badge } from "#ui/badge";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const SortManager = observer(
	React.memo(() => {
		const [t] = useTranslation("domain");
		const viewSetup = use$(modsView$.activeViewSetupInActiveCategory);

		const sortOptions = [
			{
				label: "misc",
				items: [
					{ value: "characterID", label: "CharacterId (default)" },
					{ value: "slot", label: "Slot" },
					{ value: "modset", label: "Set" },
					{ value: "rolls", label: "# of Stat Upgrades" },
					{ value: "character", label: "Character" },
					{ value: "reRolledCount", label: "Calibrations" },
					{ value: "totalCalibrations", label: "Total Calibrations" },
					{ value: "calibrationPrice", label: "Calibration Price" },
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
				items: modScores.map((modScore) => ({
					value: `ModScore${modScore.name}`,
					label: modScore.displayName,
				})),
			},
		];

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
					<Computed>
						{() => {
							return (
								<For each={modsView$.activeViewSetupInActiveCategory.sort}>
									{(sortConfig$) => {
										const sortConfig = use$(sortConfig$);

										return (
											<Badge
												variant={"outline"}
												className={"flex items-center"}
											>
												<ReactiveMultiColumnSelect
													key={`sort-option-${sortConfig.id}`}
													groups={sortOptions}
													selectedValue$={sortConfig$.sortBy}
												/>
												<Button
													size={"xxs"}
													variant={"outline"}
													onClick={() => {
														if (sortConfig$.sortOrder.peek() === "asc") {
															sortConfig$.sortOrder.set("desc");
														} else {
															sortConfig$.sortOrder.set("asc");
														}
													}}
												>
													<Show
														if={() => sortConfig.sortOrder === "asc"}
														else={() => (
															<FontAwesomeIcon
																icon={faSortDown}
																title="Sort descending"
															/>
														)}
													>
														{() => (
															<FontAwesomeIcon
																icon={faSortUp}
																title="Sort ascending"
															/>
														)}
													</Show>
												</Button>
												<Button
													size={"xxs"}
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
									}}
								</For>
							);
						}}
					</Computed>
				</div>
			</div>
		);
	}),
);

SortManager.displayName = "SortManager";

export default SortManager;
