import objectFromEntries from './objectFromEntries'

/**
 * Filter an object's entries to only those that pass some predicate
 *
 * @param {Object} obj
 * @param {(key, value) => Boolean} predicate
 */
export function filterObject(obj: Object, predicate: (key: string, value: any) => boolean) {
    return objectFromEntries(Object.entries(obj)
        .filter(([key, value]) => predicate(key, value)))
}