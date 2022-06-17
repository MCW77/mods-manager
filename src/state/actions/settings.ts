export const SET_SETTINGS_POSITION = 'SET_SETTINGS_POSITION' as const;

export function setSettingsPosition(section: string, topic: number) {
  return {
    type: SET_SETTINGS_POSITION,
    section,
    topic,
  } as const;
}
