// state
import type { Observable } from "@legendapp/state";

// domain
import type {
	MaterialById,
	MaterialsPersistedData,
	MaterialByIdForProfile,
} from "./Materials";

interface MaterialsObservable {
	persistedData: MaterialsPersistedData;
	materialByIdByAllycode: () => Observable<
		Record<string, MaterialByIdForProfile>
	>;
	materialByIdForActiveAllycode: () => Observable<MaterialById>;
	addProfile: (allycode: string) => void;
	deleteProfile: (allycode: string) => void;
	reset: () => void;
}

const getInitialMaterials = (): MaterialsPersistedData => {
	const materials: MaterialsPersistedData = {};
	return materials;
};

export { type MaterialsObservable, getInitialMaterials };
