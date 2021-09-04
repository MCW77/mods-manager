/**
 * Convert an array into an object, where the object's keys are the result of calling keyFunc on each
 * element in the array
 * @template T
 * @param arr Array[T]
 * @param keyFunc T => *
 */
export default function groupByKey<T>(arr: T[], keyFunc:(item: T) => string) {
  return arr.reduce((obj: {[key: string]: T}, item) => {
    obj[keyFunc(item)] = item;
    return obj;
  }, {});
}
