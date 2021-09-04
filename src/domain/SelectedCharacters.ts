import { CharacterNames } from "../constants/characterSettings";
import { FlatOptimizationPlan, OptimizationPlan } from "./OptimizationPlan";

export type FlatSelectedCharacters = SelectedCharacter[];
export type SelectedCharacters = SelectedCharacter[];

export interface SelectedCharacter {
  id: CharacterNames;
  target: OptimizationPlan;
}

export interface FlatSelectedCharacter {
  id: CharacterNames;
  target: FlatOptimizationPlan;
}

