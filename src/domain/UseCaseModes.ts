const UseCaseModesObj = {
  GAAndTW: '',
  LSTB: '1',
  DSTB: '2',
  Arena: '3',
} as const;

type UseCaseModes = typeof UseCaseModesObj[keyof typeof UseCaseModesObj];


export type { UseCaseModes };