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

// components
import { Input } from "#/components/reactive/Input";
import { Slider } from "#/components/reactive/Slider";
import { Switch } from "#/components/reactive/Switch";
import { Badge } from "#ui/badge";
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { ReactiveMultiColumnSelect } from "#/components/ReactiveMultiColumnSelect";

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
		items: [
			{
				label: "501ST",
				value: "Faction--501st",
			},
			{
				label: "Bad Batch",
				value: "Faction--Bad Batch",
			},
			{
				label: "Bounty Hunter",
				value: "Faction--Bounty Hunter",
			},
			{
				label: "Clone Trooper",
				value: "Faction--Clone Trooper",
			},
			{
				label: "Droid",
				value: "Faction--Droid",
			},
			{
				label: "Empire",
				value: "Faction--Empire",
			},
			{
				label: "Ewok",
				value: "Faction--Ewok",
			},
			{
				label: "First Order",
				value: "Faction--First Order",
			},
			{
				label: "Galactic Republic",
				value: "Faction--Galactic Republic",
			},
			{
				label: "Geonosian",
				value: "Faction--Geonosian",
			},
			{
				label: "Gungan",
				value: "Faction--Gungan",
			},
			{
				label: "Hutt Cartel",
				value: "Faction--Hutt Cartel",
			},
			{
				label: "Imperial Remnant",
				value: "Faction--Imperial Remnant",
			},
			{
				label: "Imperial Trooper",
				value: "Faction--Imperial Trooper",
			},
			{
				label: "Inquisitorius",
				value: "Faction--Inquisitorius",
			},
			{
				label: "Jawa",
				value: "Faction--Jawa",
			},
			{
				label: "Jedi",
				value: "Faction--Jedi",
			},
			{
				label: "Jedi Vanguard",
				value: "Faction--Jedi Vanguard",
			},
			{
				label: "Mandalorian",
				value: "Faction--Mandalorian",
			},
			{
				label: "Mercenary",
				value: "Faction--Mercenary",
			},
			{
				label: "Nightsister",
				value: "Faction--Nightsister",
			},
			{
				label: "Old Republic",
				value: "Faction--Old Republic",
			},
			{
				label: "Phoenix",
				value: "Faction--Phoenix",
			},
			{
				label: "Pirate",
				value: "Faction--Pirate",
			},
			{
				label: "Rebel",
				value: "Faction--Rebel",
			},
			{
				label: "Rebel Fighter",
				value: "Faction--Rebel Fighter",
			},
			{
				label: "Resistance",
				value: "Faction--Resistance",
			},
			{
				label: "Rogue One",
				value: "Faction--Rogue One",
			},
			{
				label: "Scoundrel",
				value: "Faction--Scoundrel",
			},
			{
				label: "Separatist",
				value: "Faction--Separatist",
			},
			{
				label: "Sith",
				value: "Faction--Sith",
			},
			{
				label: "Sith Empire",
				value: "Faction--Sith Empire",
			},
			{
				label: "Smuggler",
				value: "Faction--Smuggler",
			},
			{
				label: "Spectre",
				value: "Faction--Spectre",
			},
			{
				label: "Tusken",
				value: "Faction--Tusken",
			},
			{
				label: "Unaligned Force User",
				value: "Faction--Unaligned Force User",
			},
			{
				label: "Wookiee",
				value: "Faction--Wookiee",
			},
		],
	},
	{
		label: "Role",
		items: [
			{
				label: "Attacker",
				value: "Role--Attacker",
			},
			{
				label: "Fleet Commander",
				value: "Role--Fleet Commander",
			},
			{
				label: "Galactic Legend",
				value: "Role--Galactic Legend",
			},
			{
				label: "Healer",
				value: "Role--Healer",
			},
			{
				label: "Leader",
				value: "Role--Leader",
			},
			{
				label: "Order 66 Raid",
				value: "Role--[c][ffff33]Order 66 Raid[-][/c]",
			},
			{
				label: "Pilot",
				value: "Role--Pilot",
			},
			{
				label: "Support",
				value: "Role--Support",
			},
			{
				label: "Tank",
				value: "Role--Tank",
			},
		],
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
				value: "Namboo-Maul/Sidious/Nute",
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
];

const CharacterFilters: React.FC = observer(() => {
	return (
		<div className="p2 grid grid-cols-2 gap-2">
			<div className="flex flex-col gap-2">
				<div>
					<Label className="p-r-2" htmlFor={"hide-selected"}>
						Hide selected
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
				<div className={"flex gap-1"}>
					<Label className="p-r-2" htmlFor={"custom-character-filter"}>
						Custom filter
					</Label>
					<ReactiveMultiColumnSelect
						id={"custom-character-filter"}
						groups={customCharacterFilterGroups}
						selectedValue$={charactersManagement$.filterSetup.customFilterId}
					/>
				</div>
				<div className={"flex flex-col gap-1"}>
					<div className={"flex gap-2 m-t-2"}>
						<Memo>
							<Input
								className="mb-2 bg-background text-foreground rounded-2 placeholder-muted-foreground placeholder-opacity-50"
								type="text"
								placeholder="name, tag, or acronym"
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
													size={"xxs"}
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
				<div>
					<Label className="p-r-2" htmlFor={"stars-range"}>
						Stars
					</Label>
					<Computed>
						<Slider
							className="min-w-[19%]"
							id={"stars-range"}
							max={7}
							min={0}
							step={1}
							$value={charactersManagement$.filterSetup.starsRange}
							onValueChange={(newValues: number[]) => {
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
				<div>
					<Label className="p-r-2" htmlFor={"level-range"}>
						Level
					</Label>
					<Computed>
						<Slider
							id={"level-range"}
							max={85}
							min={0}
							step={1}
							$value={charactersManagement$.filterSetup.levelRange}
							onValueChange={(newValues: number[]) => {
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
				<div>
					<Label className="p-r-2" htmlFor={"gearLevel-range"}>
						Gear
					</Label>
					<Computed>
						<Slider
							id={"gearLevel-range"}
							max={23}
							min={1}
							step={1}
							$value={charactersManagement$.filterSetup.gearLevelRange}
							onValueChange={(newValues: number[]) => {
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
