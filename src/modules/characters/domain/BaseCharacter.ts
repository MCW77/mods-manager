// utils
import groupByKey from "#/utils/groupByKey";

// domain
import type { CharacterNames } from "#/constants/CharacterNames";
import { createOptimizationPlan, OptimizationPlan } from "../../../domain/OptimizationPlan";

type APIBaseCharacterAlignments = 0 | 1 | 2 | 3;
type BaseCharacterAlignments = "noforce" | "neutral" | "light" | "dark";

interface BaseSkill {
  display: string;
  key: string;
  leader: boolean;
  mode: APIBaseOmicronMode;
}

interface APIBaseCharacterCategory {
  display: string;
  key: string;
}
interface APIBaseSkill {
  display: string;
  key: string;
  leader: boolean;
  mode: keyof typeof APIBaseOmicronMode;
}
interface APITarget {
  name: string;
  health: number;
  protection: number;
  speed: number;
  critDmg: number;
  potency: number;
  tenacity: number;
  physDmg: number;
  specDmg: number;
  critChance: number;
  armor: number;
  resistance: number;
  accuracy: number;
  critAvoid: number;
  upgradeMods: boolean;
  primaryStatRestrictions: {};
  setRestrictions: {};
  targetStats: [];
  useOnlyFullSets: boolean;
}

interface APIBaseCharacter {
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
  target: APITarget | null;
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
  galacticLegend: boolean;
  id: CharacterNames;
  name: string;
  omicrons: BaseSkill[];
  target: OptimizationPlan | null;
  zetas: BaseSkill[];
}

const API2BaseCharacterAlignment = {
  0: "noforce",
  1: "neutral",
  2: "light",
  3: "dark",
} as const;

const APIBaseOmicronMode = {
  0: "",
  4: "raid",
  7: "tb",
  8: "tw",
  9: "gac",
  11: "conquest",
  12: "gc",
  14: "3v3gac",
  15: "5v5gac",
} as const;

type APIBaseOmicronMode = (typeof APIBaseOmicronMode)[keyof typeof APIBaseOmicronMode];

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
          avatarUrl: bc.baseImage,
          categories: categories,
          description: bc.description,
          galacticLegend: bc.galacticLegend,
          id: bc.baseId,
          name: bc.name,
          omicrons: bc.omicron.map((skill) => ({
            display: skill.display,
            key: skill.key,
            leader: skill.leader,
            mode: APIBaseOmicronMode[skill.mode],
          })),
          target:
            bc.target !== null
              ? createOptimizationPlan(
                  bc.target.name,
                  "",
                  bc.target.health,
                  bc.target.protection,
                  bc.target.speed,
                  bc.target.critDmg,
                  bc.target.potency,
                  bc.target.tenacity,
                  bc.target.physDmg,
                  bc.target.specDmg,
                  bc.target.critChance,
                  bc.target.armor,
                  bc.target.resistance,
                  bc.target.accuracy,
                  bc.target.critAvoid,
                  5,
                  bc.target.primaryStatRestrictions,
                  bc.target.setRestrictions,
                  bc.target.targetStats,
                  bc.target.useOnlyFullSets,
                )
              : null,
          zetas: bc.zeta.map((skill) => ({
            display: skill.display,
            key: skill.key,
            leader: skill.leader,
            mode: APIBaseOmicronMode[skill.mode],
          })),
        };
      }),
    (bc: BaseCharacter) => bc.id,
  ) as BaseCharacterById;
}

export type BaseCharacterById = Record<CharacterNames, BaseCharacter>;

export const defaultBaseCharacter: BaseCharacter = {
  alignment: "light",
  avatarUrl: "",
  categories: [],
  description: "",
  galacticLegend: false,
  id: "FINN",
  name: "",
  omicrons: [],
  target: createOptimizationPlan(
    "",
    "",
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    5,
    {},
    {},
    [],
    true,
  ),
  zetas: [],
};
