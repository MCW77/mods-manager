export type SecondaryStatNames =
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

export interface C3POSecondaryStatDTO {
	roll: string[];
	unscaledRollValue: number[];
	stat: {
		unitStatId: SecondaryStatNames;
		statValueDecimal: string;
		unscaledDecimalValue: string;
		uiDisplayOverrideValue: string;
		scalar: string;
	};
	statRolls: number;
	statRollerBoundsMax: string;
	statRollerBoundsMin: string;
}
