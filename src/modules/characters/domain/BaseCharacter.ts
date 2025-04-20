// utils
import groupByKey from "#/utils/groupByKey";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

export type APIBaseCharacterAlignments = 0 | 1 | 2 | 3;
export type BaseCharacterAlignments = "noforce" | "neutral" | "light" | "dark";

export interface APIBaseCharacterCategory {
	display: string;
	key: string;
}
export interface APIBaseCharacter {
	baseId: CharacterNames;
	name: string;
	baseImage: string;
	combatType: number;
	categories: string[];
	description: string;
	fleetCommander: boolean;
	galacticLegend: boolean;
	alignment: APIBaseCharacterAlignments;
	role: APIBaseCharacterCategory[];
	shipSlot: number;
	affiliation: APIBaseCharacterCategory[];
	species: APIBaseCharacterCategory[];
	profession: APIBaseCharacterCategory[];
	other: APIBaseCharacterCategory[];
}

/**
 * interface to hold static settings for each character that the optimizer knows about.
 */
export interface BaseCharacter {
	id: CharacterNames;
	name: string;
	avatarUrl: string;
	categories: string[];
	description: string;
	alignment: BaseCharacterAlignments;
}

const API2BaseCharacterAlignment = {
	0: "noforce",
	1: "neutral",
	2: "light",
	3: "dark",
};

export function mapAPI2BaseCharacterById(baseCharacters: APIBaseCharacter[]) {
	return groupByKey(
		baseCharacters
			.filter((bc) => bc.combatType === 1)
			.map((bc) => {
				let categories = bc.affiliation
					.concat(bc.profession)
					.concat(bc.role)
					.concat(bc.species)
					.concat(bc.other ? bc.other : [])
					.map((category) => category.display)
					.concat(bc.shipSlot !== 0 ? ["Crew Member"] : [])
					.concat(bc.galacticLegend ? ["Galactic Legend"] : [])
					.concat(bc.fleetCommander ? ["Fleet Commander"] : []);
				let alignments: string[] = [];
				if (bc.alignment === 2) {
					alignments = ["light", "lightside", "ls"];
					if (bc.other?.some((entry) => entry.key === "unaligned_force_user"))
						alignments = alignments.concat(["lsufu"]);
				}
				if (bc.alignment === 3) {
					alignments = ["dark", "darkside", "ds"];
					if (bc.other?.some((entry) => entry.key === "unaligned_force_user"))
						alignments = alignments.concat(["dsufu"]);
				}
				categories = categories.concat(alignments);

				return {
					id: bc.baseId,
					name: bc.name,
					avatarUrl: `https://api.hotutils.com/images${bc.baseImage}`,
					categories: categories,
					description: bc.description,
					alignment: API2BaseCharacterAlignment[bc.alignment],
				} as BaseCharacter;
			}),
		(bc: BaseCharacter) => bc.id,
	) as BaseCharacterById;
}

export type BaseCharacterById = Record<CharacterNames, BaseCharacter>;

export type BaseCharacters = BaseCharacter[];

export const defaultBaseCharacter = {
	id: "FINN",
	name: "",
	avatarUrl: "https://swgoh.gg/static/img/assets/blank-character.png",
	categories: [],
	description: "",
	alignment: "light",
} as BaseCharacter;
