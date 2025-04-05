export const getRandomUnicodeCharacter = (): string => {
  const minUnicode = 33; // Starting from '!' (decimal 33)
  const maxUnicode = 65535; // Ending at '\uFFFF' (decimal 65535)

  const randomCode =
    Math.floor(Math.random() * (maxUnicode - minUnicode + 1)) + minUnicode;
  return String.fromCharCode(randomCode);
};
