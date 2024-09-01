import { createOptimizationPlan } from "../domain/OptimizationPlan";

const optimizationStrategy = {
	"Speed with survivability": createOptimizationPlan(
		"Speed with survivability",
		"",
		5, // health
		5, // protection
		100, // speed
		0, // crit damage
		0, // potency
		5, // tenacity
		0, // physical damage
		0, // special damage
		0, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	Speed: createOptimizationPlan(
		"Speed",
		"",
		0, // health
		0, // protection
		100, // speed
		0, // crit damage
		0, // potency
		0, // tenacity
		0, // physical damage
		0, // special damage
		0, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Speed, Crit, and Physical Damage": createOptimizationPlan(
		"Speed, Crit, and Physical Damage",
		"",
		0, // health
		0, // protection
		100, // speed
		100, // crit damage
		0, // potency
		0, // tenacity
		50, // physical damage
		0, // special damage
		50, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Speed, Crit, and Special Damage": createOptimizationPlan(
		"Speed, Crit, and Special Damage",
		"",
		0, // health
		0, // protection
		100, // speed
		100, // crit damage
		0, // potency
		0, // tenacity
		50, // physical damage
		0, // special damage
		50, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Speed, Crit, and Mixed Damage": createOptimizationPlan(
		"Speed, Crit, and Mixed Damage",
		"",
		0, // health
		0, // protection
		100, // speed
		100, // crit damage
		0, // potency
		0, // tenacity
		50, // physical damage
		50, // special damage
		50, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Speed, Crit, Physical Damage, Potency": createOptimizationPlan(
		"Speed, Crit, Physical Damage, Potency",
		"",
		0, // health
		0, // protection
		100, // speed
		100, // crit damage
		25, // potency
		0, // tenacity
		50, // physical damage
		0, // special damage
		50, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Speed, Crit, Special Damage, Potency": createOptimizationPlan(
		"Speed, Crit, Special Damage, Potency",
		"",
		0, // health
		0, // protection
		100, // speed
		100, // crit damage
		25, // potency
		0, // tenacity
		0, // physical damage
		50, // special damage
		50, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Speed, Crit, Mixed Damage, Potency": createOptimizationPlan(
		"Speed, Crit, Mixed Damage, Potency",
		"",
		0, // health
		0, // protection
		100, // speed
		100, // crit damage
		25, // potency
		0, // tenacity
		50, // physical damage
		50, // special damage
		50, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Speedy debuffer": createOptimizationPlan(
		"Speedy debuffer",
		"",
		0, // health
		0, // protection
		100, // speed
		0, // crit damage
		25, // potency
		0, // tenacity
		0, // physical damage
		0, // special damage
		0, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Slow Crit, Physical Damage, Potency": createOptimizationPlan(
		"Slow Crit, Physical Damage, Potency",
		"",
		0, // health
		0, // protection
		10, // speed
		100, // crit damage
		25, // potency
		0, // tenacity
		50, // physical damage
		0, // special damage
		50, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Speedy Chex Mix": createOptimizationPlan(
		"Speedy Chex Mix",
		"",
		0, // health
		0, // protection,
		50, // speed
		0, // crit damage
		0, // potency
		0, // tenacity,
		100, // physical damage
		0, // special damage
		0, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Special Damage": createOptimizationPlan(
		"Special Damage",
		"",
		0, // health
		0, // protection,
		100, // speed
		0, // crit damage
		0, // potency
		0, // tenacity,
		0, // physical damage
		50, // special damage
		0, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Mixed Damage": createOptimizationPlan(
		"Mixed Damage",
		"",
		0, // health
		0, // protection,
		100, // speed
		0, // crit damage
		0, // potency
		0, // tenacity,
		50, // physical damage
		50, // special damage
		0, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
	"Special Damage with Potency": createOptimizationPlan(
		"Special Damage with Potency",
		"",
		0, // health
		0, // protection,
		100, // speed
		0, // crit damage
		25, // potency
		0, // tenacity,
		0, // physical damage
		50, // special damage
		0, // crit chance
		0, // armor
		0, // resistance
		0, // accuracy
		0, // crit avoidance
	),
};

Object.freeze(optimizationStrategy);

export default optimizationStrategy;
