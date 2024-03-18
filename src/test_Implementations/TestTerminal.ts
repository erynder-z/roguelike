import { DrawableTerminal } from '../components/Terminal/Interfaces/DrawableTerminal';

/**
 * Utility class for testing and demonstrating terminal functionality.
 */
export class TestTerminal {
  /**
   * Draws a single character at the specified coordinates with the given colors for testing purposes.
   * @param terminal - The terminal interface to test.
   */
  static drawSingleCharacterTest(terminal: DrawableTerminal) {
    terminal.drawAt(0, 0, 'a', 'white', 'gray');
  }

  /**
   * Draws a pattern on the terminal using various colors and characters for testing purposes.
   * @param terminal - The terminal to test.
   * @param additionalString - The string to be displayed at specific coordinates (2, 3).
   */
  static drawPatternTest(terminal: DrawableTerminal, additionalString: string) {
    for (let y = 0; y < terminal.dimensions.y; ++y) {
      for (let x = 0; x < terminal.dimensions.x; ++x) {
        const calculationFactor = 5 * y * x + 3 * x;
        const charCode = (calculationFactor % 26) + 'a'.charCodeAt(0);
        const character = String.fromCharCode(charCode);
        const backgroundColor =
          '#' +
          ((calculationFactor + 0) % 16).toString(16) +
          ((calculationFactor + 5) % 16).toString(16) +
          ((calculationFactor + 10) % 16).toString(16);
        terminal.drawAt(x, y, character, 'white', backgroundColor);
      }
    }
    terminal.drawText(2, 1, '##.##', 'white', 'black');
    terminal.drawText(2, 2, '#@.k!', 'white', 'black');
    terminal.drawText(2, 3, additionalString, 'yellow', 'red');
  }
}
