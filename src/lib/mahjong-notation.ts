const TILE_SUFFIX_RE = /([A-Za-z]|\.)/;
const DIGIT_RE = /\d/;
/** Expand grouped notation, e.g. "123m" to "1m2m3m". */
export function expandMahjongNotation(text: string) {
  const charArr = text.trim().split("");
  const result: string[] = [];
  let stack: string[] = [];
  let indicator: string;
  for (const char of charArr) {
    if (TILE_SUFFIX_RE.test(char)) {
      indicator = char;

      for (let j = 0; j < stack.length; j++) {
        result.push(`${stack[j]}${indicator}`);
      }

      stack = [];
    } else if (DIGIT_RE.test(char)) {
      stack.push(char);
    } else {
      // Preserve unsuffixed digits before emitting a symbol.
      result.push(...stack);
      stack = [];
      result.push(char);
    }
  }
  return result.concat(stack).join("");
}
