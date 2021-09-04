export default function cleanAllyCode(allyCode: string) {
  return allyCode.replace(/[^\d]/g, '');
}
