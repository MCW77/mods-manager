import { Mod } from './Mod';

export default class ModScore {
  constructor(
    public name: string,
    public displayName: string,
    public description: string,
    public isFlatOrPercentage: "IsPercentage" | "IsFlat",
    public scoringAlgorithm: (mod: Mod) => number)
  {

  }
}