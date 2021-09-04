export default function firstOrNull<T>(arr: Array<T>) {
  if ('undefined' !== typeof arr[0]) {
    return arr[0];
  } else {
    return null;
  }
};
