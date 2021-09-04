import { FlatSelectedCharacters, SelectedCharacters } from "./SelectedCharacters";

export type FlatCharacterTemplates = FlatCharacterTemplate[];
export type CharacterTemplates = CharacterTemplate[];

export interface FlatCharacterTemplate {
  name: string,
  selectedCharacters: FlatSelectedCharacters
}

export interface CharacterTemplate {
  name: string,
  selectedCharacters: SelectedCharacters
}

export interface CharacterTemplatesByName {
  [key: string]: CharacterTemplate;
};

