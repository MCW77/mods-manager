// utils
import groupByKey from "#/utils/groupByKey";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";

export type APIBaseCharacterAlignments = 0 | 1 | 2 | 3;
export type BaseCharacterAlignments = "noforce" | "neutral" | "light" | "dark";

export interface BaseSkill {
	display: string;
	key: string;
	leader: boolean;
	mode: APIBaseOmicronMode;
}

export interface APIBaseCharacterCategory {
	display: string;
	key: string;
}
export interface APIBaseSkill {
	display: string;
	key: string;
	leader: boolean;
	mode: APIBaseOmicronMode;
}
export interface APIBaseCharacter {
	affiliation: APIBaseCharacterCategory[];
	alignment: APIBaseCharacterAlignments;
	baseId: CharacterNames;
	baseImage: string;
	categories: string[];
	combatType: number;
	description: string;
	fleetCommander: boolean;
	galacticLegend: boolean;
	name: string;
	omicron: APIBaseSkill[];
	other: APIBaseCharacterCategory[];
	profession: APIBaseCharacterCategory[];
	role: APIBaseCharacterCategory[];
	shipSlot: number;
	species: APIBaseCharacterCategory[];
	zeta: APIBaseSkill[];
}

/**
 * interface to hold static settings for each character that the optimizer knows about.
 */
export interface BaseCharacter {
	alignment: BaseCharacterAlignments;
	avatarUrl: string;
	categories: string[];
	description: string;
	id: CharacterNames;
	name: string;
	omicrons: BaseSkill[];
	zetas: BaseSkill[];
}

const API2BaseCharacterAlignment = {
	0: "noforce",
	1: "neutral",
	2: "light",
	3: "dark",
} as const;

const APIBaseOmicronMode = {
	4: "raid",
	7: "tb",
	8: "tw",
	9: "gac",
	11: "conquest",
	12: "gc",
	14: "3v3gac",
	15: "5v5gac",
} as const;

type APIBaseOmicronMode =
	(typeof APIBaseOmicronMode)[keyof typeof APIBaseOmicronMode];

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
					alignment: API2BaseCharacterAlignment[bc.alignment],
					avatarUrl: `https://api.hotutils.com/images${bc.baseImage}`,
					categories: categories,
					description: bc.description,
					id: bc.baseId,
					name: bc.name,
					omicrons: bc.omicron.map((skill) => ({
						display: skill.display,
						key: skill.key,
						leader: skill.leader,
						mode: skill.mode,
					})),
					zetas: bc.zeta.map((skill) => ({
						display: skill.display,
						key: skill.key,
						leader: skill.leader,
						mode: skill.mode,
					})),
				};
			}),
		(bc: BaseCharacter) => bc.id,
	) as BaseCharacterById;
}

export type BaseCharacterById = Record<CharacterNames, BaseCharacter>;

export type BaseCharacters = BaseCharacter[];

export const defaultBaseCharacter = {
	alignment: "light",
	avatarUrl: "https://swgoh.gg/static/img/assets/blank-character.png",
	categories: [],
	description: "",
	id: "FINN",
	name: "",
	omicrons: [],
	zetas: [],
} as BaseCharacter;
