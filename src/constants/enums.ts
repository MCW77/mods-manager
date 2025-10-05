enum ModSetsEnum {
	Health = 1,
	Offense = 2,
	Defense = 3,
	Speed = 4,
	Critchance = 5,
	Critdamage = 6,
	Potency = 7,
	Tenacity = 8,
}

const modSlots = ["square", "arrow", "diamond", "triangle", "circle", "cross"];
/*
const modSlots = {
  1: 'square',
  2: 'arrow',
  3: 'diamond',
  4: 'triangle',
  5: 'circle',
  6: 'cross',
};
*/

enum ModSlotsEnum {
	Square = 1,
	Arrow = 2,
	Diamond = 3,
	Triangle = 4,
	Circle = 5,
	Cross = 6,
}

enum ModTiersEnum {
	Grey = 1,
	Green = 2,
	Blue = 3,
	Purple = 4,
	Gold = 5,
}

enum ModSecondariesScoreTiersEnum {
	Green = 1,
	Blue = 2,
	Purple = 3,
	Gold = 4,
}

export {
	modSlots,
	ModSlotsEnum,
	ModSetsEnum,
	ModTiersEnum,
	ModSecondariesScoreTiersEnum,
};
