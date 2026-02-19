// state
import { observable, type ObservableObject } from "@legendapp/state";

// domain
import type { ModScore } from "../domain/ModScore";
import { modScorers } from "../domain/ModScorer";
import { Mod } from "#/domain/Mod";

interface ModScoresObservable {
  ById: Map<string, ModscoreByName>;
  getModScore: (mod: Mod, scoreName: string) => ModScore;
  getModScoreTier: (modScore: ModScore) => number;
}

type ModscoreByName = Map<string, ModScore>;

const modScores$: ObservableObject<ModScoresObservable> = observable({
  ById: new Map<string, ModscoreByName>(),
  getModScore: (mod, scoreName) => {

    const modId = mod.id;
    if (!modScores$.ById.has(modId)) {
      modScores$.ById.set(modId, new Map<string, ModScore>());
    }
    const modScoresOfId = modScores$.ById.get(modId).get();

    if (!modScoresOfId.has(scoreName)) {
      const modScorer = modScorers.get(scoreName);
      if (!mod || !modScorer) {
        return { displayValue: "0", value: 0 };
      }

      const modsScoreValue = modScorer.scoringAlgorithm(mod);
      const modsScore: ModScore = {
        displayValue: modScorer.isFlatOrPercentage === "IsFlat"
								? `${modsScoreValue}`
								: `${Math.floor(modsScoreValue * 100) / 100}%`,
        value: modsScoreValue,
      };
      modScoresOfId.set(scoreName, modsScore);
    }
    return modScoresOfId.get(scoreName) || { displayValue: "0", value: 0 };
  },
  getModScoreTier(modScore) {
    return Math.floor(modScore.value / 20);
  },
});

export { modScores$ };