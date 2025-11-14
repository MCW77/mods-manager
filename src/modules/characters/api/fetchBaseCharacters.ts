import {
	type BaseCharacterById,
	mapAPI2BaseCharacterById,
} from "../domain/BaseCharacter.js";

export async function fetchCharacters(): Promise<BaseCharacterById> {
	return fetch("https://api.mods-optimizer.swgoh.grandivory.com/characters/")
		.then((response) => response.json())
		.then((response) => {
			return mapAPI2BaseCharacterById(response.units);
		})
		.catch();
}
