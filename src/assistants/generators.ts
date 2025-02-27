export function generateNumericCode(length: number) {
  let result = "";
  const characters = "0123456789";
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}
