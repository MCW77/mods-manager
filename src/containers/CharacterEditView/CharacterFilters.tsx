// state
import { Computed, For, observer } from "@legendapp/state/react";

const { stateLoader$ } = await import("#/modules/stateLoader/stateLoader");

const charactersManagement$ = stateLoader$.charactersManagement$;

// components
import { Badge } from "#ui/badge";
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { Slider } from "#ui/slider";
import { Switch } from "#ui/switch";
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
		],
	},
	{
		label: "Faction",
		items: [
			{
				label: "501ST",
				value: "501ST",
			},
			{
				label: "Bad Batch",
				value: "Bad Batch",
			},
			{
				label: "Droid",
				value: "Droid",
			},
			{
				label: "Bounty Hunter",
				value: "Bounty Hunter",
			},
			{
				label: "Clone Trooper",
				value: "Clone Trooper",
			},
			{
				label: "Empire",
				value: "Empire",
			},
			{
				label: "Ewok",
				value: "Ewok",
			},
			{
				label: "First Order",
				value: "First Order",
			},
			{
				label: "Galactic Republic",
				value: "Galactic Republic",
			},
			{
				label: "Geonosian",
				value: "Geonosian",
			},
			{
				label: "Gungan",
				value: "Gungan",
			},
			{
				label: "Hutt Cartel",
				value: "Hutt Cartel",
			},
			{
				label: "Imperial Remnant",
				value: "Imperial Remnant",
			},
			{
				label: "Imperial Trooper",
				value: "Imperial Trooper",
			},
			{
				label: "Inquisitorius",
				value: "Inquisitorius",
			},
			{
				label: "Jawa",
				value: "Jawa",
			},
			{
				label: "Jedi",
				value: "Jedi",
			},
			{
				label: "Mandalorian",
				value: "Mandalorian",
			},
			{
				label: "Mercenary",
				value: "Mercenary",
			},
			{
				label: "Nightsister",
				value: "Nightsister",
			},
			{
				label: "Old Republic",
				value: "Old Republic",
			},
			{
				label: "Phoenix",
				value: "Phoenix",
			},
			{
				label: "Rebel",
				value: "Rebel",
			},
			{
				label: "Rebel Fighter",
				value: "Rebel Fighter",
			},
			{
				label: "Resistance",
				value: "Resistance",
			},
			{
				label: "Rogue One",
				value: "Rogue One",
			},
			{
				label: "Scoundrel",
				value: "Scoundrel",
			},
			{
				label: "Separatist",
				value: "Separatist",
			},
			{
				label: "Sith",
				value: "Sith",
			},
			{
				label: "Sith Empire",
				value: "Sith Empire",
			},
			{
				label: "Smuggler",
				value: "Smuggler",
			},
			{
				label: "Spectre",
				value: "Spectre",
			},
			{
				label: "Tusken",
				value: "Tusken",
			},
			{
				label: "Unaligned Force User",
				value: "Unaligned Force User",
			},
			{
				label: "Wookiee",
				value: "Wookiee",
			},
		],
	},
	{
		label: "Role",
		items: [
			{
				label: "Attacker",
				value: "Attacker",
			},
			{
				label: "Fleet Commander",
				value: "Fleet Commander",
			},
			{
				label: "Galactic Legend",
				value: "Galactic Legend",
			},
			{
				label: "Healer",
				value: "Healer",
			},
			{
				label: "Leader",
				value: "Leader",
			},
			{
				label: "Pilot",
				value: "Pilot",
			},
			{
				label: "Support",
				value: "Support",
			},
			{
				label: "Tank",
				value: "Tank",
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
		<div className="p2 flex flex-col gap-2">
			<div>
				<Label className="p-r-2" htmlFor={"hide-selected"}>
					Hide selected
				</Label>
				<Switch
					id={"hide-selected"}
					checked={charactersManagement$.filterSetup.hideSelectedCharacters.get()}
					onCheckedChange={() =>
						charactersManagement$.filterSetup.hideSelectedCharacters.set(
							!charactersManagement$.filterSetup.hideSelectedCharacters.get(),
						)
					}
				/>
			</div>
			<div>
				<Label className="p-r-2" htmlFor={"stars-range"}>
					Stars
				</Label>
				<Slider
					id={"stars-range"}
					max={7}
					min={0}
					step={1}
					value={charactersManagement$.filterSetup.starsRange.get()}
					onValueChange={(newValues: [number, number]) => {
						const [newMin, newMax] = newValues;
						if (newMin <= newMax) {
							charactersManagement$.filterSetup.starsRange.set(newValues);
						} else {
							charactersManagement$.filterSetup.starsRange.set([
								newMax,
								newMax,
							]);
						}
					}}
				/>
			</div>
			<div>
				<Label className="p-r-2" htmlFor={"level-range"}>
					Level
				</Label>
				<Slider
					id={"level-range"}
					max={85}
					min={0}
					step={1}
					value={charactersManagement$.filterSetup.levelRange.get()}
					onValueChange={(newValues: [number, number]) => {
						const [newMin, newMax] = newValues;
						if (newMin <= newMax) {
							charactersManagement$.filterSetup.levelRange.set(newValues);
						} else {
							charactersManagement$.filterSetup.levelRange.set([
								newMax,
								newMax,
							]);
						}
					}}
				/>
			</div>
			<div>
				<Label className="p-r-2" htmlFor={"gearLevel-range"}>
					Gear
				</Label>
				<Slider
					id={"gearLevel-range"}
					max={22}
					min={1}
					step={1}
					value={charactersManagement$.filterSetup.gearLevelRange.get()}
					onValueChange={(newValues: [number, number]) => {
						const [newMin, newMax] = newValues;
						if (newMin <= newMax) {
							charactersManagement$.filterSetup.gearLevelRange.set(newValues);
						} else {
							charactersManagement$.filterSetup.gearLevelRange.set([
								newMax,
								newMax,
							]);
						}
					}}
				/>
			</div>
			<div className={"flex flex-col gap-1"}>
				<Label className="p-r-2" htmlFor={"custom-character-filter"}>
					Custom filter
				</Label>
				<ReactiveMultiColumnSelect
					id={"custom-character-filter"}
					groups={customCharacterFilterGroups}
					selectedValue$={charactersManagement$.filterSetup.customFilterId}
				/>
			</div>
			<div className={"flex gap-2 m-t-2"}>
				<input
					className="mb-2 bg-black color-white rounded-2 placeholder-blue-500 placeholder-opacity-50"
					id="character-filter"
					type="text"
					placeholder="name, tag, or acronym"
					value={charactersManagement$.filterSetup.quickFilter.filter.get()}
					onChange={(e) =>
						charactersManagement$.filterSetup.quickFilter.filter.set(
							e.target.value.toLowerCase(),
						)
					}
				/>
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
					{() => {
						return (
							<For each={charactersManagement$.filterSetup.filtersById}>
								{(filter$) => {
									return (
										<div
											key={`sort-option-${filter$.id.get()}`}
											className={"flex items-center"}
										>
											<Badge variant={"outline"}>
												{filter$.filter.get()}
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
						);
					}}
				</Computed>
			</div>
		</div>
	);
});

CharacterFilters.displayName = "CharacterFilters";

export default CharacterFilters;
