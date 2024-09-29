// state
import { Computed, For, observer } from "@legendapp/state/react";
import { charactersManagement$ } from "#/modules/charactersManagement/state/charactersManagement";

// components
import { Badge } from "#ui/badge";
import { Button } from "#ui/button";
import { Label } from "#ui/label";
import { Slider } from "#ui/slider";
import { Switch } from "#ui/switch";

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

export { CharacterFilters };
