export const SET_HELP_POSITION = 'SET_HELP_POSITION' as const;

export function setHelpPosition(section: string, topic: number) {
  return {
    type: SET_HELP_POSITION,
    section,
    topic,
  } as const;
}
