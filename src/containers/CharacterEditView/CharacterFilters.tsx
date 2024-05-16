// state
import { observer } from "@legendapp/state/react";

// components
import { Label } from "#/components/ui/label";
import { Switch } from "#/components/ui/switch";
import { charactersManagement$ } from "#/modules/charactersManagement/state/charactersManagement";

const CharacterFilters: React.FC = observer(() => {
	return (
		<div className="p2 flex flex-col">
			<input
				className="mb-2 bg-black color-white rounded-2 placeholder-blue-500 placeholder-opacity-50"
				id="character-filter"
				type="text"
				placeholder="name, tag, or acronym"
				value={charactersManagement$.filters.characterFilter.get()}
				onChange={(e) =>
					charactersManagement$.filters.characterFilter.set(
						e.target.value.toLowerCase(),
					)
				}
			/>
			<div>
				<Label className="p-r-2" htmlFor={"hide-selected"}>
					Hide selected
				</Label>
				<Switch
					id={"hide-selected"}
					checked={charactersManagement$.filters.hideSelectedCharacters.get()}
					onCheckedChange={() =>
						charactersManagement$.filters.hideSelectedCharacters.set(
							!charactersManagement$.filters.hideSelectedCharacters.get(),
						)
					}
				/>
			</div>
		</div>
	);
});

CharacterFilters.displayName = "CharacterFilters";

export { CharacterFilters };
