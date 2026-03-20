import { fromShortOptimizationPlan } from "../domain/OptimizationPlan";

const optimizationStrategy = {
	"Speed with survivability": fromShortOptimizationPlan({
		id: "Speed with survivability",
		health: 5,
		prot: 5,
		spd: 100,
		ten: 5,
	}),
	Speed: fromShortOptimizationPlan({
		id: "Speed",
		spd: 100,
	}),
	"Speed, Crit, and Physical Damage": fromShortOptimizationPlan({
		id: "Speed, Crit, and Physical Damage",
		spd: 100,
		cd: 100,
		phys: 50,
		cc: 50,
	}),
	"Speed, Crit, and Special Damage": fromShortOptimizationPlan({
		id: "Speed, Crit, and Special Damage",
		spd: 100,
		cd: 100,
		spec: 50,
		cc: 50,
	}),
	"Speed, Crit, and Mixed Damage": fromShortOptimizationPlan({
		id: "Speed, Crit, and Mixed Damage",
		spd: 100,
		cd: 100,
		phys: 50,
		spec: 50,
		cc: 50,
	}),
	"Speed, Crit, Physical Damage, Potency": fromShortOptimizationPlan({
		id: "Speed, Crit, Physical Damage, Potency",
		spd: 100,
		cd: 100,
		pot: 25,
		phys: 50,
		cc: 50,
	}),
	"Speed, Crit, Special Damage, Potency": fromShortOptimizationPlan({
		id: "Speed, Crit, Special Damage, Potency",
		spd: 100,
		cd: 100,
		pot: 25,
		spec: 50,
		cc: 50,
	}),
	"Speed, Crit, Mixed Damage, Potency": fromShortOptimizationPlan({
		id: "Speed, Crit, Mixed Damage, Potency",
		spd: 100,
		cd: 100,
		pot: 25,
		phys: 50,
		spec: 50,
		cc: 50,
	}),
	"Speedy debuffer": fromShortOptimizationPlan({
		id: "Speedy debuffer",
		spd: 100,
		pot: 25,
	}),
	"Slow Crit, Physical Damage, Potency": fromShortOptimizationPlan({
		id: "Slow Crit, Physical Damage, Potency",
		spd: 10,
		cd: 100,
		pot: 25,
		phys: 50,
		cc: 50,
	}),
	"Speedy Chex Mix": fromShortOptimizationPlan({
		id: "Speedy Chex Mix",
		spd: 50,
		phys: 100,
	}),
	"Special Damage": fromShortOptimizationPlan({
		id: "Special Damage",
		spd: 100,
		spec: 50,
	}),
	"Mixed Damage": fromShortOptimizationPlan({
		id: "Mixed Damage",
		spd: 100,
		phys: 50,
		spec: 50,
	}),
	"Special Damage with Potency": fromShortOptimizationPlan({
		id: "Special Damage with Potency",
		spd: 100,
		pot: 25,
		spec: 50,
	}),
};

Object.freeze(optimizationStrategy);

export default optimizationStrategy;
