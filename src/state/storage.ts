// domain
import { PlayerProfile } from "../domain/PlayerProfile";

export interface IAppState {
	profile: PlayerProfile; // All the data about the current character
}

export class AppState {
	static readonly Default: IAppState = {
		profile: PlayerProfile.Default, // All the data about the current character
	};
}
