export function groupBy<Keys extends keyof any, T>(arr: T[], keyFunc: (obj: T) => Keys) {
  return arr.reduce((collection, element: T) => {
    const key = keyFunc(element);
    collection[key] = (collection[key] || []).concat([element]);
    return collection;
  }, {} as Record<Keys, T[]>);
}