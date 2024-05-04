import type { PlanEditing } from "#/modules/planEditing/domain/PlanEditing";

// domain
import type * as OptimizationPlan from "#/domain/OptimizationPlan";

type StatWeightsInputProps = {
	target$: PlanEditing;
	stat: OptimizationPlan.OptimizableStats;
};

export type { StatWeightsInputProps };
