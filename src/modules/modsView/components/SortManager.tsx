// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { Computed, For, Memo, observer, reactive, Show } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// domain
import * as ModScoresConsts from "#/domain/constants/ModScoresConsts";
import { SecondaryStats } from "#/domain/Stats";

// components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";

import { Button } from "#ui/button";
import { Label } from "#ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

const ReactiveSelect = reactive(Select);

const SortManager = observer(
	React.memo(() => {
		const [t] = useTranslation("domain");
		const viewSetup = modsView$.activeViewSetupInActiveCategory.get();

		const statOptions = SecondaryStats.SecondaryStat.statNames.map((stat) => (
			<SelectItem value={`Stat${stat}`} key={stat}>
				{t(`stats.${stat}`)}
			</SelectItem>
		));

		const statScoreOptions = SecondaryStats.SecondaryStat.statNames.map(
			(stat) => (
				<SelectItem value={`StatScore${stat}`} key={stat}>
					{t(`stats.${stat}`)}
				</SelectItem>
			),
		);

		const modScoreOptions = ModScoresConsts.modScores.map((modScore) => (
			<SelectItem
				value={`ModScore${modScore.name}`}
				key={modScore.name}
				title={modScore.description}
			>
				{modScore.displayName}
			</SelectItem>
		));

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
							return <For each={modsView$.activeViewSetupInActiveCategory.sort}>
							{(sortConfig$) => {
								return (
									<div className={"flex items-center"}>
									<ReactiveSelect
										key={`sort-option-${sortConfig$.id.peek()}`}
										$value={() => sortConfig$.sortBy.get()}
										onValueChange={(value) => {
											sortConfig$.sortBy.set(value);
										}}
									>
										<SelectTrigger
											className={"w-40 h-4 px-2 mx-2 inline-flex"}
											id={`sort-option-${sortConfig$.id.peek()}`}
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent
											className={"min-w-40"}
											position={"popper"}
											side={"bottom"}
											align={"start"}
											sideOffset={5}
										>
											<SelectGroup>
												<SelectItem className={"w-40"} value={"characterID"}>
													{"CharacterId (default)"}
												</SelectItem>
												<SelectItem className={"w-40"} value={"slot"}>
													{"Slot"}
												</SelectItem>
												<SelectItem className={"w-40"} value={"set"}>
													{"Set"}
												</SelectItem>
												<SelectItem className={"w-40"} value={"rolls"}>
													{"# of Stat Upgrades"}
												</SelectItem>
												<SelectItem className={"w-40"} value={"character"}>
													{"Character"}
												</SelectItem>
												<SelectItem className={"w-40"} value={"reRolledCount"}>
													{"Calibrations"}
												</SelectItem>
												<SelectItem className={"w-40"} value={"totalCalibrations"}>
													{"Total Calibrations"}
												</SelectItem>
												<SelectItem className={"w-40"} value={"calibrationPrice"}>
													{"Calibration Price"}
												</SelectItem>
											</SelectGroup>
											<SelectGroup>
												<SelectLabel>Stats</SelectLabel>
												{statOptions}
											</SelectGroup>
											<SelectGroup>
												<SelectLabel>Stat Scores</SelectLabel>
												{statScoreOptions}
											</SelectGroup>
											<SelectGroup>
												<SelectLabel>Mod Scores</SelectLabel>
												{modScoreOptions}
											</SelectGroup>
										</SelectContent>
									</ReactiveSelect>
									<Button
										size={"xxs"}
										onClick={() => {
											if (sortConfig$.sortOrder.get() === "asc") {
												sortConfig$.sortOrder.set("desc")
											} else {
												sortConfig$.sortOrder.set("asc")
											}
										}}
									>
										<Show
											if={() => sortConfig$.sortOrder.get() === "asc"}
											else={() =><FontAwesomeIcon icon={faSortDown} title="Sort descending" />}
										>
											{() =>
												<FontAwesomeIcon icon={faSortUp} title="Sort ascending" />
											}
										</Show>
									</Button>
									<Button
										size={"xxs"}
										onClick={() => modsView$.activeViewSetupInActiveCategory.sort.get().delete(sortConfig$.id.peek())}
									>
										x
									</Button>
									</div>
								);
							}}
							</For>
						}}
					</Computed>
				</div>
			</div>
		);
	}),
);

SortManager.displayName = "SortManager";

export { SortManager };
