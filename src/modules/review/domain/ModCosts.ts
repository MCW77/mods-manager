// domain
import type * as ModTypes from "#/domain/types/ModTypes";
import type { Pips } from "#/domain/Pips";

// A map from number of pips that a mod has to the cost to remove it
const modRemovalCosts = {
	5: 4750,
	6: 8000,
};

// A map from number of pips to a map from current mod level to the total cost to upgrade the mod to level 15
const modUpgradeCosts: {
	[key in Pips]: {
		[key2 in ModTypes.Levels]: number;
	};
} = {
	6: {
		1: 0,
		2: 0,
		3: 0,
		4: 0,
		5: 0,
		6: 0,
		7: 0,
		8: 0,
		9: 0,
		10: 0,
		11: 0,
		12: 0,
		13: 0,
		14: 0,
		15: 0,
	},
	5: {
		1: 248400,
		2: 244950,
		3: 241500,
		4: 238050,
		5: 234600,
		6: 229950,
		7: 224300,
		8: 218500,
		9: 210500,
		10: 200150,
		11: 189800,
		12: 162200,
		13: 126550,
		14: 90900,
		15: 0,
	},
};

export { modRemovalCosts, modUpgradeCosts };
