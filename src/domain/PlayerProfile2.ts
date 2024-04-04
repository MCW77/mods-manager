 // domain
 import { CharacterNames } from "#/constants/characterSettings";
 import { PlayerValuesByCharacter } from "../modules/profilesManagement/domain/PlayerValues";
 import * as ModTypes from "./types/ModTypes";

import * as Character from "./Character";
import { Mod } from "./Mod";
import { OptimizationPlan } from "./OptimizationPlan";
import * as OptimizerRun from "./OptimizerRun";
import { SelectedCharacters } from "./SelectedCharacters";
import { TargetStat } from "./TargetStat";
import { Allycode } from "../modules/profilesManagement/domain/Allycode";

 export type MissedGoals = [TargetStat, number][];

 export interface ModSuggestion {
   id: CharacterNames;
   target: OptimizationPlan;
   assignedMods: string[];
   missedGoals: MissedGoals;
   messages?: string[];
 }

 export interface IGlobalSettings {
   modChangeThreshold: number;
   lockUnselectedCharacters: boolean;
   forceCompleteSets: boolean;
   simulate6EModSlice: boolean;
 };

 export interface IFlatPlayerProfile {
   allyCode: string;
   playerName: string;
   characters: {[key in CharacterNames]: Character.Character};
   mods: ModTypes.GIMOFlatMod[];
   selectedCharacters: SelectedCharacters;
   modAssignments: ModSuggestion[];
   globalSettings: IGlobalSettings;
   hotUtilsSessionId?: string | null;
 }

/**
 * Class to hold information about how a particular player is using the optimizer - their character setup and mods
 */
 export class PlayerProfile {
   allyCode: Allycode;
   playerName: string;
   characters: Character.Characters;
   playerValues: PlayerValuesByCharacter
   mods: Mod[];
   selectedCharacters: SelectedCharacters;
   modAssignments: ModSuggestion[];
   globalSettings: IGlobalSettings;
   hotUtilsSessionId: string | null;

   static Default: PlayerProfile = new PlayerProfile(
     new Allycode(''),
     "",
     {} as PlayerValuesByCharacter,
     {} as Character.Characters,
     [],
     [],
     [],
     {
        modChangeThreshold: 0,
        lockUnselectedCharacters: true,
        forceCompleteSets: true,
        simulate6EModSlice: false,
     },
     null,
   );

   static defaultGlobalSettings: IGlobalSettings = {
      modChangeThreshold: 0,
      lockUnselectedCharacters: false,
      forceCompleteSets: false,
      simulate6EModSlice: false,
   };

   /**
    * @param allyCode {string} The ally code for the player whose data this is
    * @param playerName {string} The player name associated with this profile
    * @param playerValues {Object<string, PlayerValues>} A map from character IDs to player values
    * @param characters {Object<string, Character>} A map from character IDs to character objects
    * @param mods {Array<Mod>} An array of Mods
    * @param selectedCharacters {Array<ISelectedCharacter>} An array of Objects with Character IDs and OptimizationPlans
    * @param modAssignments {Array<Object>} An array of character definitions and assigned mods
    * @param globalSettings {Object} An object containing settings that apply in the context of a player, rather than a character
    * @param hotUtilsSessionId {string} The session ID for the HotUtils session
    */
   constructor(
     allyCode: Allycode,
     playerName: string,
     playerValues: PlayerValuesByCharacter = {} as PlayerValuesByCharacter,
     characters: Character.Characters = {} as Character.Characters,
     mods: Mod[] = [],
     selectedCharacters: SelectedCharacters = [],
     modAssignments: ModSuggestion[] = [],
     globalSettings: IGlobalSettings = PlayerProfile.defaultGlobalSettings,
     hotUtilsSessionId: string | null = null,
   ) {
     this.allyCode = allyCode;
     this.playerName = playerName;
     this.playerValues = playerValues;
     this.characters = characters;
     this.mods = mods;
     this.selectedCharacters = selectedCharacters;
     this.modAssignments = modAssignments;
     this.globalSettings = globalSettings;
     this.hotUtilsSessionId = hotUtilsSessionId;
   }

   withPlayerName(name: string) {
     if (name) {
       return new PlayerProfile(
         this.allyCode,
         name,
         this.playerValues,
         this.characters,
         this.mods,
         this.selectedCharacters,
         this.modAssignments,
         this.globalSettings,
         this.hotUtilsSessionId,
       )
     } else {
       return this;
     }
   }

   withCharacters(characters: Character.Characters) {
     if (characters) {
       return new PlayerProfile(
         this.allyCode,
         this.playerName,
         this.playerValues,
         characters,
         this.mods,
         this.selectedCharacters,
         this.modAssignments,
         this.globalSettings,
         this.hotUtilsSessionId,
       );
     } else {
       return this;
     }
   }

   withMods(mods: Mod[]) {
     if (mods) {
       return new PlayerProfile(
         this.allyCode,
         this.playerName,
         this.playerValues,
         this.characters,
         mods,
         this.selectedCharacters,
         this.modAssignments,
         this.globalSettings,
         this.hotUtilsSessionId,
       );
     } else {
       return this;
     }
   }

   withSelectedCharacters(selectedCharacters: SelectedCharacters) {
     if (selectedCharacters) {
       return new PlayerProfile(
         this.allyCode,
         this.playerName,
         this.playerValues,
         this.characters,
         this.mods,
         selectedCharacters,
         this.modAssignments,
         this.globalSettings,
         this.hotUtilsSessionId,
       );
     } else {
       return this;
     }
   }

   withModAssignments(modAssignments: ModSuggestion[]) {
     if (modAssignments) {
       // TODO
 /*
       this.mods.forEach((mod: Mod, i: number, mods: Mod[]) => {
         mod.assignedID = modAssignments.includes(mod.characterID) ? mod.characterID : 'null'
       });
 */
       return new PlayerProfile(
         this.allyCode,
         this.playerName,
         this.playerValues,
         this.characters,
         this.mods,
         this.selectedCharacters,
         modAssignments,
         this.globalSettings,
         this.hotUtilsSessionId,
       );
     } else {
       return this;
     }
   }

   withGlobalSettings(globalSettings: IGlobalSettings) {
     return new PlayerProfile(
       this.allyCode,
       this.playerName,
       this.playerValues,
       this.characters,
       this.mods,
       this.selectedCharacters,
       this.modAssignments,
       globalSettings,
       this.hotUtilsSessionId,
     );
   }

   withHotUtilsSessionId(id: string | null) {
     if (id === null) return this;
     return new PlayerProfile(
       this.allyCode,
       this.playerName,
       this.playerValues,
       this.characters,
       this.mods,
       this.selectedCharacters,
       this.modAssignments,
       this.globalSettings,
       id,
     )
   }

   /**
    * Convert this full PlayerProfile into only what is needed to store the values form an optimizer run
    * @returns OptimizerRun
    */
   toOptimizerRun() {
     return OptimizerRun.createOptimizerRun(
       this.allyCode.value,
       this.characters,
       this.mods.map(mod => mod.serialize()),
       this.selectedCharacters,
       this.globalSettings,
     );
   }

   serialize() {
     return {
       allyCode: this.allyCode.value,
       playerName: this.playerName,
       characters: this.characters,
       mods: this.mods.map(mod => mod.serialize()),
       selectedCharacters: this.selectedCharacters.map(({ id, target }) => ({ id: id, target: target! })),
       modAssignments: this.modAssignments,
       globalSettings: this.globalSettings,
       hotUtilsSessionId: this.hotUtilsSessionId,
     };
   }

   static deserialize(flatPlayerProfile: IFlatPlayerProfile): PlayerProfile {
     if (flatPlayerProfile) {
       return new PlayerProfile(
         new Allycode(flatPlayerProfile.allyCode),
         flatPlayerProfile.playerName,
         {} as PlayerValuesByCharacter,
         flatPlayerProfile.characters,
         flatPlayerProfile.mods.map(Mod.deserialize),
         flatPlayerProfile.selectedCharacters.map(({ id, target }) => ({ id: id, target: target })),

         flatPlayerProfile.modAssignments.map(({id, target, assignedMods, missedGoals, messages}) => {
                     return {
             id: id,
             target: target,
             assignedMods: assignedMods,
             missedGoals: missedGoals,
             messages: messages
           }  as ModSuggestion
         }) as ModSuggestion[],
         Object.assign({}, PlayerProfile.defaultGlobalSettings, flatPlayerProfile.globalSettings),
         flatPlayerProfile.hotUtilsSessionId || null,
       )
     } else {
       return PlayerProfile.Default;
     }
   }
 }

