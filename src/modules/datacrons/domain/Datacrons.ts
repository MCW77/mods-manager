import type { StatId } from "../../hotUtils/domain/StatIDs";

interface Affix {
	abilityId: string;
	requiredRelicTier: number;
	requiredUnitTier: number;
	scopeIcon: string;
	statType: StatId;
	statValue: number;
	tag: string[];
	targetRule: string;
}
interface Datacron {
	affix: Affix[];
	focused: boolean;
	id: string;
	locked: boolean;
	name: string;
	rerollCount: number;
	rerollIndex: number;
	rerollOption: Affix[];
	setId: number;
	tag: string[];
	templateId: string;
}

type DatacronById = Map<string, Datacron>;

interface DatacronByIdForProfile {
	id: string;
	datacronById: DatacronById;
}

type DatacronsPersistedData = Record<string, DatacronByIdForProfile>;

export type {
	Affix,
	DatacronById,
	DatacronsPersistedData,
	Datacron,
	DatacronByIdForProfile,
};
