export type Rolls = "1" | "2" | "3" | "4" | "5";

export type SecondaryStatNames =
	| ""
	| "Critical Chance"
	| "Defense"
	| "Defense %"
	| "Health"
	| "Health %"
	| "Offense"
	| "Offense %"
	| "Potency"
	| "Protection"
	| "Protection %"
	| "Speed"
	| "Tenacity";

type SecondaryStatPos = 1 | 2 | 3 | 4;
type t4 = `secondaryStat-${SecondaryStatPos}-Name`;

export type SecondariesNameIndexer = {
	[key in t4]: SecondaryStatNames | null;
};

interface SecondaryStat1Props {
	"secondaryStat-1-Name": SecondaryStatNames;
	"secondaryStat-1-Value": string;
	"secondaryStat-1-Roll": Rolls;
}

interface SecondaryStat2Props {
	"secondaryStat-2-Name": SecondaryStatNames;
	"secondaryStat-2-Value": string;
	"secondaryStat-2-Roll": Rolls;
}

interface SecondaryStat3Props {
	"secondaryStat-3-Name": SecondaryStatNames;
	"secondaryStat-3-Value": string;
	"secondaryStat-3-Roll": Rolls;
}

interface SecondaryStat4Props {
	"secondaryStat-4-Name": SecondaryStatNames;
	"secondaryStat-4-Value": string;
	"secondaryStat-4-Roll": Rolls;
}

type SecondaryStatGroup<T> = T | Partial<Record<keyof T, undefined>>;

export interface C3POSecondaryStatDTO {
	name: SecondaryStatNames;
	value: string;
	rolls: Rolls;
}

export type C3POSecondaryStatsDTO = SecondaryStatGroup<SecondaryStat1Props> &
	SecondaryStatGroup<SecondaryStat2Props> &
	SecondaryStatGroup<SecondaryStat3Props> &
	SecondaryStatGroup<SecondaryStat4Props> &
	SecondariesNameIndexer;
