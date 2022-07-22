import { Character } from "./Character";


interface OptimizationStatus {
  character: Character | null;
  progress: number;
  step: string;
}


export type { OptimizationStatus };
