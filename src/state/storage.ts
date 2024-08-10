// domain
import { PlayerProfile } from "../domain/PlayerProfile";

export interface IAppState {
	profile: PlayerProfile; // All the data about the current character
}

export const defaultAppState = {
	profile: structuredClone(PlayerProfile.Default),
}