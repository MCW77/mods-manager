export default function cleanAllycode(allycode: string) {
  return allycode.replace(/[^\d]/g, '');
}
