import type { StackRankParameters } from "./StackRankParameters.js";

interface StackRankSettings {
	overwrite: "false" | "true";
	useCase: "" | "1" | "2" | "3";
	parameters: StackRankParameters;
}

export type { StackRankSettings };
