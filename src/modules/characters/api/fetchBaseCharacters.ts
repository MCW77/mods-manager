import {
	type BaseCharactersById,
	mapAPI2BaseCharactersById,
} from "../domain/BaseCharacter";

export async function fetchCharacters(): Promise<BaseCharactersById> {
	return fetch("https://api.mods-optimizer.swgoh.grandivory.com/characters/")
		.then((response) => response.json())
		.then((response) => {
			return mapAPI2BaseCharactersById(response.units);
		})
		.catch();
}
