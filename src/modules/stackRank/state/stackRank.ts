// state
import { observable } from "@legendapp/state";
import { StackRankParameters } from "../domain/StackRankParameters";

// api
import { fetchRankedCharacters } from "../api/fetchRankedCharacters";

// domain
import { CharacterNames } from "#/constants/characterSettings";

const stackRank$ = observable<{
  parameters: StackRankParameters,
  useCase: string,
  fetch: (allyCode: string) => Promise<CharacterNames[]>,
}>({
  parameters: {
    alignmentFilter: "0",
    ignoreArena: true,
    minimumGearLevel: 1,
    top: 0,
  },
  useCase: '0',
  fetch: async (allyCode: string): Promise<CharacterNames[]> => {
    const aT = stackRank$.peek();
    if (aT.parameters.top === 0) delete aT.parameters.top;
    try {
      const characters = await fetchRankedCharacters(allyCode, aT.useCase, aT.parameters);
      return characters;
    } catch (error) {
      throw error;
    }
  }
});

export { stackRank$ };