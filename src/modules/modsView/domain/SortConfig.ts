export interface SortConfig {
	id: string;
	sortBy: string;
	sortOrder: "asc" | "desc";
}

export type SortConfigById = Map<string, SortConfig>;
export type PersistableSortConfigById = Record<string, SortConfig>;
export const createSortConfig = (sortBy: string, sortOrder: "asc" | "desc") => {
	const id = crypto.randomUUID();
	return {
		id,
		sortBy,
		sortOrder,
	};
};
