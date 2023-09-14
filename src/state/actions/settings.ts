import { SettingsSections } from "../../domain/SettingsSections";

export namespace actions {
	export function setSettingsPosition(section: SettingsSections, topic: number) {
		return {
			type: actionNames.SET_SETTINGS_POSITION,
			section,
			topic,
		} as const;
	}
}

export namespace actionNames {
	export const SET_SETTINGS_POSITION = "SET_SETTINGS_POSITION" as const;
}
