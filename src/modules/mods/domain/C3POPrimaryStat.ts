type C3POPrimaryStatNames = 5 | 16 | 17 | 18 | 48 | 49 | 52 | 53 | 54 | 55 | 56;

interface C3POPrimaryStat {
	roll: string[];
	unscaledRollValue: number[];
	stat: {
		unitStatId: C3POPrimaryStatNames;
		statValueDecimal: string;
		unscaledDecimalValue: string;
		uiDisplayOverrideValue: string;
		scalar: string;
	};
	statRolls: number;
	statRollerBoundsMax: string;
	statRollerBoundsMin: string;
}

export type { C3POPrimaryStatNames, C3POPrimaryStat };
