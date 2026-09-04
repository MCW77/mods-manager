type C3POSecondaryStatNames =
	| 1
	| 5
	| 17
	| 18
	| 28
	| 41
	| 42
	| 48
	| 49
	| 53
	| 55
	| 56;

interface C3POSecondaryStat {
	roll: string[];
	unscaledRollValue: number[];
	stat: {
		unitStatId: C3POSecondaryStatNames;
		statValueDecimal: string;
		unscaledDecimalValue: string;
		uiDisplayOverrideValue: string;
		scalar: string;
	};
	statRolls: number;
	statRollerBoundsMax: string;
	statRollerBoundsMin: string;
}

export type { C3POSecondaryStatNames, C3POSecondaryStat };
