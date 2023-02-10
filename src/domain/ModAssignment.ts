// domain
import { CharacterNames } from "../constants/characterSettings";
import { GIMOFlatMod } from "./types/ModTypes";

import { Mod } from "./Mod";
import { FlatOptimizationPlan, OptimizationPlan } from "./OptimizationPlan";
import { MissedGoals } from "./PlayerProfile";


interface FlatModAssignment {
  id: CharacterNames;
  target: FlatOptimizationPlan;
  assignedMods: GIMOFlatMod[];
  missedGoals: MissedGoals;
  messages?: string[];

}

interface ModAssignment {
  id: CharacterNames;
  target: OptimizationPlan;
  assignedMods: Mod[];
  missedGoals: MissedGoals;
  messages?: string[];
}

type ModAssignments = ModAssignment[];


export type { ModAssignment, ModAssignments };
