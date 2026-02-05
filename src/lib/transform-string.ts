export function transformString(text: string) {
  let charArr = text.trim().split("");
  const result = [];
  var stack = [];
  var indicator;
  for (let i = 0; i < charArr.length; i++) {
    if (/([A-Za-z])/.test(charArr[i])) {
      // indicators (m, p, s, z)
      indicator = charArr[i];

      for (let j = 0; j < stack.length; j++) {
        result.push(`${stack[j]}${indicator}`);
      }

      stack = [];
    } else if (/\d/.test(charArr[i])) {
      // numbers
      stack.push(charArr[i]);
    } else {
      //symbols (*, -, =)
      result.push(`${charArr[i]}`);
    }
  }
  console.log(result.concat(stack).join(""));
  return result.concat(stack).join("");
}
