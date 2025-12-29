interface Affix {
	abilityId: string;
	requiredRelicTier: number;
	requiredUnitTier: number;
	scopeIcon: string;
	statType: number;
	statValue: number;
	tag: string[];
	targetRule: string;
}
interface Datacron {
	affix: Affix[];
	focused: boolean;
	id: string;
	locked: boolean;
	rerollCount: number;
	rerollIndex: number;
	rerollOption: Affix[];
	setId: number;
	tag: string[];
	templateId: string;
	name: string;
}

type DatacronsById = Map<string, Datacron>;

interface DatacronsPersistedData {
	datacrons: {
		id: "datacrons";
		datacronsById: DatacronsById;
	};
}

export type { DatacronsById, DatacronsPersistedData, Datacron };
