// state
import { observable } from "@legendapp/state";
import type { StackRankParameters } from "../domain/StackRankParameters";

// api
import { fetchRankedCharacters } from "../api/fetchRankedCharacters";

// domain
import type { CharacterNames } from "#/constants/characterSettings";

const stackRank$ = observable<{
	parameters: StackRankParameters;
	useCase: string;
	fetch: (allycode: string) => Promise<CharacterNames[]>;
}>({
	parameters: {
		alignmentFilter: "0",
		ignoreArena: true,
		minimumGearLevel: 1,
		top: 0,
	},
	useCase: "0",
	fetch: async (allycode: string): Promise<CharacterNames[]> => {
		const aT = stackRank$.peek();
		if (aT.parameters.top === 0) delete aT.parameters.top;
		try {
			const characters = await fetchRankedCharacters(
				allycode,
				aT.useCase,
				aT.parameters,
			);
			return characters;
		} catch (error) {
			throw error;
		}
	},
});

export { stackRank$ };
