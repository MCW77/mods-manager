import type { Character } from "#/domain/Character.js";

export type CharacterFilterPredicate = (character: Character) => boolean;

export interface TextFilter {
	id: string;
	type: "text";
	filter: string;
}

export interface CustomFilter {
	id: string;
	type: "custom";
	filter: string;
	filterPredicate: CharacterFilterPredicate;
}

export type CharacterFilter = TextFilter | CustomFilter;

export type CharacterFilterById = Map<string, CharacterFilter>;
export type CustomFilterById = Map<string, CustomFilter>;

export const createTextCharacterFilter = (filter: string): CharacterFilter => {
	return {
		id: crypto.randomUUID(),
		type: "text",
		filter,
	};
};

export const createCustomCharacterFilter = (
	filter: string,
	filterPredicate: CharacterFilterPredicate,
): CustomFilter => {
	return {
		id: crypto.randomUUID(),
		type: "custom",
		filter,
		filterPredicate,
	};
};
