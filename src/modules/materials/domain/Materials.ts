interface Material {
	bonusQuantity: number;
	id: string;
	quantity: number;
}

type MaterialById = Map<string, Material>;

interface MaterialByIdForProfile {
	id: string;
	materialById: MaterialById;
}

type MaterialsPersistedData = Record<string, MaterialByIdForProfile>;

export type {
	MaterialById,
	MaterialsPersistedData,
	Material,
	MaterialByIdForProfile,
};
