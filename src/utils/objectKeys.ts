export function objectKeys<T extends object>(object: T): (keyof T)[] {
  return Object.keys(object) as (keyof T)[];
}
