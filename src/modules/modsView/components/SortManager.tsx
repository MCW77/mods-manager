// react
import React from "react";
import { useTranslation } from "react-i18next";

// state
import { observer, reactive } from "@legendapp/state/react";
import { modsView$ } from "../state/modsView";

// domain
import * as ModScoresConsts from "#/domain/constants/ModScoresConsts";
import { SecondaryStats } from "#/domain/Stats";

// components
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
		const sortConfig$ = modsView$.activeViewSetupInActiveCategory.sort;
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
				<Label htmlFor={"sort-option-1"}>Sort by: </Label>
				<div className="flex justify-around flex-wrap gap-2">
					{[0, 1, 2, 3].map((number: number) => {
						return (
							<ReactiveSelect
								key={`sort-option-${number}`}
								$value={() => sortConfig$[number].get()}
								onValueChange={(value) => {
									sortConfig$[number].set(value);
								}}
							>
								<SelectTrigger
									className={"w-40 h-4 px-2 mx-2 inline-flex"}
									id={`sort-option-${number}`}
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
										<SelectItem className={"w-40"} value={"characterid"}>
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
						);
					})}
				</div>
			</div>
		);
	}),
);

SortManager.displayName = "SortManager";

export { SortManager };
