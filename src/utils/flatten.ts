export default function flatten<T>(arr: T[][]) {
  return arr.reduce((acc, item) => acc.concat(item), [] );
}
