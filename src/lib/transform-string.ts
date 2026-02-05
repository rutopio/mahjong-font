/**
 * Transforms mahjong notation string into displayable characters.
 * Example: "123m" -> "1m2m3m", "123." -> "1.2.3."
 */
export function transformString(text: string) {
  let charArr = text.trim().split("");
  const result = [];
  var stack = [];
  var indicator;
  for (let i = 0; i < charArr.length; i++) {
    if (/([A-Za-z]|\.)/.test(charArr[i])) {
      // Suit indicators (m, p, s, z) and tile modifiers (.)
      indicator = charArr[i];

      for (let j = 0; j < stack.length; j++) {
        result.push(`${stack[j]}${indicator}`);
      }

      stack = [];
    } else if (/\d/.test(charArr[i])) {
      // Tile numbers
      stack.push(charArr[i]);
    } else {
      // Symbols (*, -, =, etc.)
      // First flush the stack before adding the symbol (without indicator, as these digits haven't met their indicator yet)
      for (let j = 0; j < stack.length; j++) {
        result.push(stack[j]);
      }
      stack = [];
      result.push(charArr[i]);
    }
  }
  return result.concat(stack).join("");
}
