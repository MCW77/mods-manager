// react
import { useTranslation } from "react-i18next";

// state
import { Show, useObservable, useValue } from "@legendapp/state/react";

import { roster$ } from "#/modules/roster/state/roster";
import { target$ } from "#/modules/planEditing/state/planEditing";

// domain
import type { CharacterStats } from "#/domain/CharacterStats";

// components
import { Select as ReactiveSelect } from "#/components/reactive/Select";
import { Card, CardContent, CardHeader, CardTitle } from "#ui/card";
import { Item, ItemContent, ItemGroup, ItemTitle } from "#ui/item";
import {
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#ui/select";

interface StatItemProps {
	stat: keyof CharacterStats;
	statValue: number;
}

function StatItem({ stat, statValue }: StatItemProps) {
	const [t] = useTranslation("domain");
	const formattedStatValue = statValue.toLocaleString(undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	});
	const translatedStat = t(`stats.${stat}`, { defaultValue: stat });

	return (
		<Item variant={"outline"} className={"w-fit min-w-full"}>
			<ItemContent>
				<ItemTitle className={"block overflow-visible whitespace-nowrap"}>
					{translatedStat}
				</ItemTitle>
			</ItemContent>
			<ItemContent>
				<ItemTitle>{formattedStatValue}</ItemTitle>
			</ItemContent>
		</Item>
	);
}
interface StatsWidgetProps {
	stats: CharacterStats;
	title: string;
}

const defensiveStats = [
	"Health",
	"Protection",
	"Tenacity %",
	"Armor",
	"Resistance",
	"Critical Avoidance %",
] as const;

const offensiveStats = [
	"Speed",
	"Physical Critical Chance %",
	"Special Critical Chance %",
	"Critical Damage %",
	"Potency %",
	"Physical Damage",
	"Special Damage",
	"Accuracy %",
] as const;

function StatsWidget({ stats, title }: StatsWidgetProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={"flex flex-col gap-4"}>
					<div className={"flex gap-4"}>
						<ItemGroup className={"w-fit"}>
							{defensiveStats.map((statName) => (
								<StatItem
									key={statName}
									stat={statName}
									statValue={stats[statName]}
								/>
							))}
						</ItemGroup>
						<ItemGroup className={"w-fit"}>
							{offensiveStats.map((statName) => (
								<StatItem
									key={statName}
									stat={statName}
									statValue={stats[statName]}
								/>
							))}
						</ItemGroup>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function RelicSimulationWidget() {
	const [t] = useTranslation("optimize-ui");
	const relicTier$ = useObservable<number>(() => {
		const characterId = target$.characterId.get();
		const character = roster$.activeCharacterById.get()[characterId];
		if (character?.playerValues.gearLevel !== 13) {
			return 0;
		}
		return character.playerValues.relicTier;
	});
	const regularStats = useValue(() => {
		const characterId = target$.characterId.get();
		const character = roster$.activeCharacterById.get()[characterId];
		return character?.playerValues.equippedStats;
	});
	const simulatedStats = useValue(
		() =>
			target$.target.simulatedStats.get() ?? {
				Health: 0,
				Protection: 0,
				Speed: 0,
				"Critical Damage %": 0,
				"Potency %": 0,
				"Tenacity %": 0,
				"Physical Damage": 0,
				"Special Damage": 0,
				Armor: 0,
				Resistance: 0,
				"Accuracy %": 0,
				"Critical Avoidance %": 0,
				"Physical Critical Chance %": 0,
				"Special Critical Chance %": 0,
			},
	);
	const relicSimulationOptions = [
		{ value: 0, label: t("target.sections.relicSimulation.NoSimulation") },
		{ value: 2, label: "0" },
		{ value: 3, label: "1" },
		{ value: 4, label: "2" },
		{ value: 5, label: "3" },
		{ value: 6, label: "4" },
		{ value: 7, label: "5" },
		{ value: 8, label: "6" },
		{ value: 9, label: "7" },
		{ value: 10, label: "8" },
		{ value: 11, label: "9" },
		{ value: 12, label: "10" },
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t("target.sections.relicSimulation.Heading")}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={"flex flex-col gap-4"}>
					<Show
						if={() => relicTier$.get() !== 12}
						else={() => (
							<span>{t("target.sections.relicSimulation.AlreadyMaxed")}</span>
						)}
					>
						{() => (
							<ReactiveSelect
								name={"relic-simulation"}
								items={relicSimulationOptions}
								$value={target$.target.simulatedRelicLevel}
								onValueChange={(value, _eventDetails) => {
									if (value === undefined) return;
									target$.changeSimulatedRelicLevel(value);
								}}
							>
								<SelectTrigger
									className={"h-4 px-2 mx-2 inline-flex"}
									id={"mod-dots2"}
								>
									<SelectValue />
								</SelectTrigger>
								<SelectContent
									className={"min-w-12"}
									alignItemWithTrigger={false}
									sideOffset={5}
								>
									<SelectItem value={0}>
										{t("target.sections.relicSimulation.NoSimulation")}
									</SelectItem>
									<Show if={() => relicTier$.get() === 0}>
										<SelectItem value={2}>{0}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 3;
										}}
									>
										<SelectItem value={3}>{1}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 4;
										}}
									>
										<SelectItem value={4}>{2}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 5;
										}}
									>
										<SelectItem value={5}>{3}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 6;
										}}
									>
										<SelectItem value={6}>{4}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 7;
										}}
									>
										<SelectItem value={7}>{5}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 8;
										}}
									>
										<SelectItem value={8}>{6}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 9;
										}}
									>
										<SelectItem value={9}>{7}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 10;
										}}
									>
										<SelectItem value={10}>{8}</SelectItem>
									</Show>
									<Show
										if={() => {
											const relicTier = relicTier$.get();
											return relicTier < 11;
										}}
									>
										<SelectItem value={11}>{9}</SelectItem>
									</Show>
									<SelectItem value={12}>{10}</SelectItem>
								</SelectContent>
							</ReactiveSelect>
						)}
					</Show>
					<div className={"flex gap-4"}>
						<StatsWidget
							stats={regularStats}
							title={t("target.sections.relicSimulation.RegularStatsTitle")}
						/>
						<StatsWidget
							stats={simulatedStats}
							title={t("target.sections.relicSimulation.SimulatedStatsTitle")}
						/>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export { RelicSimulationWidget };
