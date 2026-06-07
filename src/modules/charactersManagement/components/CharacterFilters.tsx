// react
import { useTranslation } from "react-i18next";

// state
import {
	Computed,
	For,
	Memo,
	observer,
	useValue,
} from "@legendapp/state/react";
import { stateLoader$ } from "#/modules/stateLoader/stateLoader";

const charactersManagement$ = stateLoader$.charactersManagement$;

// domain
import { eras } from "../domain/Eras";
import { factions } from "../domain/Factions";
import { roles } from "../domain/Roles";

// components
import type { SliderRoot } from "@base-ui/react";

import { Input } from "#/components/reactive/Input";
import { ReactiveMultiColumnSelect } from "#/components/reactive/ReactiveMultiColumnSelect";
import { Slider } from "#/components/reactive/Slider";
import { Switch } from "#/components/reactive/Switch";

import { Badge } from "#ui/badge";
import { Button } from "#ui/button";
import { Label } from "#ui/label";

const eraFilterItems = eras.map((era) => ({
	label: era,
	value: `Era--${era}`,
}));

const factionFilterItems = factions.map((faction) => ({
	label: faction,
	value: `Faction--${faction}`,
}));

const roleFilterItems = roles.map((role) => ({
	label: role,
	value: `Role--${role}`,
}));

const customCharacterFilterGroups = [
	{
		label: "misc",
		items: [
			{
				label: "None",
				value: "None",
			},
			{
				label: "Has Stat Targets",
				value: "Has Stat Targets",
			},
			{
				label: "Missing Mods",
				value: "Missing Mods",
			},
			{
				label: "Needs Leveling",
				value: "Needs Leveling",
			},
			{
				label: "Locked",
				value: "Locked",
			},
			{
				label: "Unlocked",
				value: "Unlocked",
			},
			{
				label: "Missing Zetas",
				value: "Missing Zetas",
			},
			{
				label: "Missing Omicrons",
				value: "Missing Omicrons",
			},
			{
				label: "Missing GAC Omicrons",
				value: "Missing GAC Omicrons",
			},
			{
				label: "Missing TW Omicrons",
				value: "Missing TW Omicrons",
			},
			{
				label: "Missing TB Omicrons",
				value: "Missing TB Omicrons",
			},
			{
				label: "Physical Damage",
				value: "Physical Damage",
			},
			{
				label: "Special Damage",
				value: "Special Damage",
			},
			{
				label: "Mixed Damage",
				value: "Mixed Damage",
			},
		],
	},
	{
		label: "Faction",
		items: factionFilterItems,
	},
	{
		label: "Role",
		items: roleFilterItems,
	},
	{
		label: "Naboo Raid",
		items: [
			{
				label: "All",
				value: "Naboo-All",
			},
			{
				label: "QA",
				value: "Naboo-QA",
			},
			{
				label: "Maul/Sidious/Nute",
				value: "Naboo-Maul/Sidious/Nute",
			},
			{
				label: "KB",
				value: "Naboo-KB",
			},
			{
				label: "Gungans",
				value: "Naboo-Gungans",
			},
			{
				label: "Lumi",
				value: "Naboo-Lumi",
			},
			{
				label: "B2",
				value: "Naboo-B2",
			},
		],
	},
	{
		label: "Era",
		items: eraFilterItems,
	},
];

const CharacterFilters: React.FC = observer(() => {
	const [t] = useTranslation("optimize-ui");

	return (
		<div className="p2 grid grid-cols-2 gap-2">
			<div className="flex flex-col gap-2">
				<div>
					<Label className="p-r-2" htmlFor={"hide-selected"}>
						{t("sidebar.filter.ShowUnselected")}
					</Label>
					<Memo>
						<Switch
							id={"hide-selected"}
							$checked={
								charactersManagement$.filterSetup.hideSelectedCharacters
							}
						/>
					</Memo>
				</div>
				<div className={"flex flex-col gap-2"}>
					<Label htmlFor={"custom-character-filter"}>
						{t("sidebar.filter.CustomFilter")}
					</Label>
					<ReactiveMultiColumnSelect
						groups={customCharacterFilterGroups}
						triggerProps={{ className: "m-0", id: "custom-character-filter" }}
						$value={charactersManagement$.filterSetup.customFilterId}
					/>
				</div>
				<div className={"flex flex-col gap-1"}>
					<div className={"flex items-center gap-2"}>
						<Memo>
							<Input
								className="bg-background text-foreground rounded-2 placeholder-muted-foreground placeholder-opacity-50"
								type="text"
								placeholder={t("sidebar.filter.Placeholder")}
								$value={charactersManagement$.filterSetup.quickFilter.filter}
								onChange={(value) =>
									charactersManagement$.filterSetup.quickFilter.filter.set(
										value?.toLowerCase() ?? "",
									)
								}
							/>
						</Memo>
						<Button
							size={"xs"}
							variant={"outline"}
							onClick={() => {
								charactersManagement$.addTextFilter();
								charactersManagement$.filterSetup.quickFilter.filter.set("");
							}}
						>
							+
						</Button>
					</div>
					<div className="flex justify-around flex-wrap gap-2">
						<Computed>
							<For each={charactersManagement$.filterSetup.filtersById}>
								{(filter$) => {
									const filter = useValue(filter$.filter);
									const filterId = useValue(filter$.id);

									return (
										<div
											key={`sort-option-${filterId}`}
											className={"flex items-center"}
										>
											<Badge variant={"outline"}>
												{filter}
												<Button
													size={"xs"}
													variant={"outline"}
													onClick={() =>
														charactersManagement$.filterSetup.filtersById.delete(
															filter$.id.peek(),
														)
													}
												>
													x
												</Button>
											</Badge>
										</div>
									);
								}}
							</For>
						</Computed>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-2">
					<Label className="p-r-2" htmlFor={"stars-range"}>
						{t("sidebar.filter.Stars")}
					</Label>
					<Computed>
						<Slider
							className="min-w-[19%]"
							id={"stars-range"}
							max={7}
							min={0}
							step={1}
							$value={charactersManagement$.filterSetup.starsRange}
							onValueChange={(
								newValues: number | readonly number[],
								_eventDetails: SliderRoot.ChangeEventDetails,
							) => {
								if (typeof newValues === "number") return;
								const [newMin, newMax] = newValues;
								if (newMin <= newMax) {
									charactersManagement$.filterSetup.starsRange.set([
										newMin,
										newMax,
									]);
								} else {
									charactersManagement$.filterSetup.starsRange.set([
										newMax,
										newMax,
									]);
								}
							}}
						/>
					</Computed>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="p-r-2" htmlFor={"level-range"}>
						{t("sidebar.filter.Level")}
					</Label>
					<Computed>
						<Slider
							id={"level-range"}
							max={85}
							min={0}
							step={1}
							$value={charactersManagement$.filterSetup.levelRange}
							onValueChange={(
								newValues: number | readonly number[],
								_eventDetails: SliderRoot.ChangeEventDetails,
							) => {
								if (typeof newValues === "number") return;
								const [newMin, newMax] = newValues;
								if (newMin <= newMax) {
									charactersManagement$.filterSetup.levelRange.set([
										newMin,
										newMax,
									]);
								} else {
									charactersManagement$.filterSetup.levelRange.set([
										newMax,
										newMax,
									]);
								}
							}}
						/>
					</Computed>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="p-r-2" htmlFor={"gearLevel-range"}>
						{t("sidebar.filter.Gear")}
					</Label>
					<Computed>
						<Slider
							id={"gearLevel-range"}
							max={23}
							min={1}
							step={1}
							$value={charactersManagement$.filterSetup.gearLevelRange}
							onValueChange={(
								newValues: number | readonly number[],
								_eventDetails: SliderRoot.ChangeEventDetails,
							) => {
								if (typeof newValues === "number") return;
								const [newMin, newMax] = newValues;
								if (newMin <= newMax) {
									charactersManagement$.filterSetup.gearLevelRange.set([
										newMin,
										newMax,
									]);
								} else {
									charactersManagement$.filterSetup.gearLevelRange.set([
										newMax,
										newMax,
									]);
								}
							}}
						/>
					</Computed>
				</div>
			</div>
		</div>
	);
});

CharacterFilters.displayName = "CharacterFilters";

export default CharacterFilters;
