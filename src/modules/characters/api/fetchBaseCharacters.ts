import {
	type BaseCharacterById,
	mapAPI2BaseCharacterById,
} from "../domain/BaseCharacter";

const API_URL = import.meta.env.DEV
	? "http://localhost:3005/gimomock-characters"
	: "https://api.mods-optimizer.swgoh.grandivory.com/characters/";

export async function fetchCharacters(): Promise<BaseCharacterById> {
	return fetch(API_URL)
		.then((response) => response.json())
		.then((response) => {
			if (response.errorMessage !== null) {
				throw new Error("Failed to fetch base characters", {
					cause: response.errorMessage,
				});
			}
			return mapAPI2BaseCharacterById(response.units);
		})
		.catch((error) => {
			throw new Error("Failed to fetch base characters", { cause: error });
		});
}
