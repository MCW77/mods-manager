// domain
import { OptimizationStatus } from "../../domain/OptimizationStatus";


export const CANCEL_OPTIMIZE_MODS = 'CANCEL_OPTIMIZE_MODS' as const;
export const OPTIMIZE_MODS = 'OPTIMIZE_MODS' as const;
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS' as const;


export function cancelOptimizeMods() {
  return {
    type: CANCEL_OPTIMIZE_MODS
  } as const;
}

export function startModOptimization() {
  return {
    type: OPTIMIZE_MODS
  } as const;
}

export function updateProgress(progress: OptimizationStatus) {
  return {
    type: UPDATE_PROGRESS,
    progress: progress
  } as const
} 
