// state
import type { StackRankParameters } from "../domain/StackRankParameters";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

const post = async (url = "", data = {}) => {
	const requestInit: RequestInit = {
		method: "POST",
		headers: { Accept: "application/json", "Content-Type": "application/json" },
		body: JSON.stringify(data),
		mode: "cors",
	};

	const response = await fetch(url, requestInit);
	if (response.ok) {
		return response.json();
	}
	const errorText = await response.text();
	return Promise.reject(new Error(errorText));
};

export const fetchRankedCharacters = async (
	allyCode: string,
	mode: string,
	parameters: StackRankParameters,
): Promise<CharacterNames[]> => {
	try {
		const response = await post(
			"https://api.mods-optimizer.swgoh.grandivory.com/characterlist",
			{
				allyCode: allyCode,
				mode: mode,
				parameters: parameters,
			},
		);
		return response as CharacterNames[];
	} catch (error) {
		throw error;
	}
};
