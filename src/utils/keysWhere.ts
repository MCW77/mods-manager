/**
 * Collect all of the keys of an object where some predicate is true of that key's value
 */
 export default function keysWhere(obj: Object, predicate: (value: any) => boolean) {
  return Object.entries(obj)
    .filter(([key, value]) => predicate(value))
    .map(([key]) => key)
}