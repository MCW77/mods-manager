interface StackRankParameters {
	alignmentFilter: "0" | "1" | "2" | "3";
	ignoreArena: boolean;
	minimumGearLevel: number;
	top?: number;
	omicronGac: boolean;
	omicronTw: boolean;
	omicronTb: boolean;
	omicronRaids: boolean;
	omicronConquest: boolean;
}

export type { StackRankParameters };
