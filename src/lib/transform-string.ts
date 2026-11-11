/**
 * Transforms mahjong notation string into displayable characters.
 * Example: "123m" -> "1m2m3m", "123." -> "1.2.3."
 */
export function transformString(text: string) {
  const charArr = text.trim().split("");
  const result: string[] = [];
  let stack: string[] = [];
  let indicator: string;
  for (const char of charArr) {
    if (/([A-Za-z]|\.)/.test(char)) {
      // Suit indicators (m, p, s, z) and tile modifiers (.)
      indicator = char;

      for (let j = 0; j < stack.length; j++) {
        result.push(`${stack[j]}${indicator}`);
      }

      stack = [];
    } else if (/\d/.test(char)) {
      // Tile numbers
      stack.push(char);
    } else {
      // Symbols (*, -, =, etc.)
      // First flush the stack before adding the symbol (without indicator, as these digits haven't met their indicator yet)
      result.push(...stack);
      stack = [];
      result.push(char);
    }
  }
  return result.concat(stack).join("");
}
