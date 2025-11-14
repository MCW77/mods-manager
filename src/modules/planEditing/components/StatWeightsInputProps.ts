// domain
import type { PlanEditing } from "../domain/PlanEditing.js";

import type * as OptimizationPlan from "#/domain/OptimizationPlan.js";

interface StatWeightsInputProps {
	target$: PlanEditing;
	stat: OptimizationPlan.OptimizableStats;
}

export type { StatWeightsInputProps };
