import * as v from "valibot";
// domain
import { Mod } from "#/domain/Mod";
import type { GIMOFlatMod } from "#/domain/types/ModTypes";
import { PersistedModByIdForProfileByAllycodeSchema } from "#/domain/schemas/mods-manager/index";

type ModById = Map<string, Mod>;
type PersistedModById = Map<string, GIMOFlatMod>;
interface ModByIdForProfile {
	id: string;
	modById: ModById;
}
interface PersistedModByIdForProfile {
	id: string;
	modById: PersistedModById;
}

type PersistedModByIdForProfileByAllycode = Record<
	string,
	PersistedModByIdForProfile
>;

type ModsDataToPersist = Record<string, ModByIdForProfile>;

const isPersistedModByIdForProfileByAllycode = (
	obj: object,
): obj is PersistedModByIdForProfileByAllycode => {
	const safeParseResult = v.safeParse(
		PersistedModByIdForProfileByAllycodeSchema,
		obj,
	);
	return safeParseResult.success;
};

const getModsFromPersisted = (
	profile: PersistedModByIdForProfileByAllycode,
): ModsDataToPersist => {
	const allycodes = Object.keys(profile);
	if (allycodes.length === 0) {
		return {};
	}

	const modsPersistedData: ModsDataToPersist = {};
	try {
		for (const allycode of allycodes) {
			modsPersistedData[allycode] = {
				id: allycode,
				modById: new Map<string, Mod>(
					Array.from(profile[allycode].modById.entries(), ([key, mod]) => [
						key,
						Mod.deserialize(mod),
					]),
				),
			};
		}
	} catch (error) {
		console.error("Deserializing mods for profile:", profile);
		console.error("Error deserializing mods:", error);
		throw new Error("Error deserializing mods.", { cause: error });
	}

	return modsPersistedData;
};

export {
	type ModById,
	type ModByIdForProfile,
	type ModsDataToPersist,
	type PersistedModById,
	type PersistedModByIdForProfile,
	type PersistedModByIdForProfileByAllycode,
	isPersistedModByIdForProfileByAllycode,
	getModsFromPersisted,
};
