import { StackRankParameters } from "./StackRankParameters";

interface StackRankSettings {

  overwrite: 'false' | 'true',
  useCase: '' | '1' | '2' | '3',
  parameters: StackRankParameters,
}

export type { StackRankSettings };