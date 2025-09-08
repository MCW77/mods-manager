// domain
import type { ProfileOptimizationSettings } from "#/modules/optimizationSettings/domain/ProfileOptimizationSettings";

type OptimizationConditions = ProfileOptimizationSettings | null;

const createOptimizationConditions = (
	globalSettings: ProfileOptimizationSettings,
): OptimizationConditions => {
	return structuredClone(globalSettings);
};

export { type OptimizationConditions, createOptimizationConditions };
