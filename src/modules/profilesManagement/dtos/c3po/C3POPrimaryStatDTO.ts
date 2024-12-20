export type PrimaryStatNames =
	| 5
	| 16
	| 17
	| 18
	| 48
	| 49
	| 52
	| 53
	| 54
	| 55
	| 56;

export interface C3POPrimaryStatDTO {
	roll: string[];
	unscaledRollValue: number[];
	stat: {
		unitStatId: PrimaryStatNames;
		statValueDecimal: string;
		unscaledDecimalValue: string;
		uiDisplayOverrideValue: string;
		scalar: string;
	};
	statRolls: number;
	statRollerBoundsMax: string;
	statRollerBoundsMin: string;
}
