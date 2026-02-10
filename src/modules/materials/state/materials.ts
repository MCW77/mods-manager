// state
import { observable, type ObservableObject } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { persistOptions } from "#/utils/globalLegendPersistSettings";

import { profilesManagement$ } from "#/modules/profilesManagement/state/profilesManagement";

// domain
import {
	getInitialMaterials,
	type MaterialsObservable,
} from "../domain/MaterialsObservable";
import type { Material, MaterialById } from "../domain/Materials";

const materials$: ObservableObject<MaterialsObservable> =
	observable<MaterialsObservable>({
		persistedData: getInitialMaterials(),
		materialByIdForActiveAllycode: () => {
			const allycode = profilesManagement$.activeProfile.allycode.get();
			return (
				materials$.materialByIdByAllycode[allycode]?.materialById ??
				observable(new Map<string, Material>() as MaterialById)
			);
		},
		materialByIdByAllycode: () => {
			return materials$.persistedData;
		},
		addProfile: (allycode: string) => {
			if (Object.hasOwn(materials$.materialByIdByAllycode.peek(), allycode))
				return;
			materials$.materialByIdByAllycode[allycode].set({
				id: allycode,
				materialById: new Map<string, Material>(),
			});
		},
		deleteProfile: (allycode: string) => {
			if (!Object.hasOwn(materials$.materialByIdByAllycode, allycode)) return;
			materials$.materialByIdByAllycode.allycode.delete();
		},
		reset: () => {
			syncStatus$.reset();
		},
	});

profilesManagement$.lastProfileAdded.onChange(({ value }) => {
	materials$.addProfile(value);
});

profilesManagement$.lastProfileDeleted.onChange(({ value }) => {
	if (value === "all") {
		materials$.materialByIdByAllycode.set({});
		return;
	}
	materials$.deleteProfile(value);
});

const syncStatus$ = syncObservable(
	materials$.persistedData,
	persistOptions({
		persist: {
			name: "Materials",
		},
		initial: getInitialMaterials(),
	}),
);

export { materials$, syncStatus$ };
