// utils
import { BaseError } from "#/domain/BaseError";

// domain
import {
	type BaseCharacterById,
	mapAPI2BaseCharacterById,
} from "../domain/BaseCharacter";

const API_URL =
	import.meta.env.DEV && !import.meta.env.VITE_NoMock
		? "http://localhost:3005/gimomock-characters"
		: "https://api.mods-optimizer.swgoh.grandivory.com/characters/";

export async function fetchCharacters(): Promise<BaseCharacterById> {
	try {
		const response = await fetch(API_URL);
		if (!response.ok) {
			throw new BaseError(
				`HTTP Error: Failed to fetch base characters: ${response.statusText}`,
				{
					cause: response.statusText,
					error: "Failed to fetch base characters",
					reason: `The used HotUtils API didn't respond as epected. Status: ${response.status} ${response.statusText}`,
					solution:
						"This is not a Mods Manager error. If the above status doesn't present a solution, check hotutils discord if they reported server issues or maintenance",
				},
			);
		}
		const data = await response.json();
		if (data.errorMessage !== null) {
			throw new BaseError("Failed to fetch base characters", {
				cause: data.errorMessage,
				error: "Failed to fetch base characters",
				reason: `The used HotUtils API returned an error: ${data.errorMessage}`,
				solution:
					"If the above error message doesn't present a solution, check hotutils discord for it's meaning. If you can't find a solution there, ask on the mods-optimizer discord.",
			});
		}

		return mapAPI2BaseCharacterById(data.units);
	} catch (error) {
		if (error instanceof BaseError) {
			throw error;
		}

		throw new BaseError("Failed to fetch base characters", {
			cause: error,
			error: "Failed to fetch base characters",
			reason: `The used HotUtils API didn't respond. This is likely a network issue or the HotUtils API is down.`,
			solution:
				"This is not a Mods Manager error. First check your internet connection and retry. If no problem on your end check hotutils discord if they reported server issues or maintenance.",
		});
	}
}
