export interface SortConfig {
	id: string;
	sortBy: string;
	sortOrder: "asc" | "desc";
}

export type SortConfigById = Map<string, SortConfig>;
