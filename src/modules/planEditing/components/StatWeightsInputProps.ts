// domain
import type { PlanEditing } from "../domain/PlanEditing";

import type * as OptimizationPlan from "#/domain/OptimizationPlan";

interface StatWeightsInputProps {
	target$: PlanEditing;
	stat: OptimizationPlan.OptimizableStats;
};

export type { StatWeightsInputProps };
