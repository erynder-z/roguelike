import { TerminalPoint } from './TerminalPoint';

/**
 * Represents an interface for a terminal with basic drawing capabilities.
 */
export interface TerminalInterface {
  /**
   * The dimensions of the terminal grid represented as a TerminalPoint.
   */
  dimensions: TerminalPoint;

  /**
   * Draws a single character at the specified coordinates with the given foreground and background colors.
   * @param x - The x-coordinate of the character.
   * @param y - The y-coordinate of the character.
   * @param char - The character to be drawn.
   * @param fgCol - The foreground color of the character.
   * @param bgCol - The background color of the character.
   */
  drawText(
    x: number,
    y: number,
    char: string,
    fgCol: string,
    bgCol: string,
  ): void;

  /**
   * Draws a string at the specified coordinates with the given foreground and background colors.
   * @param x - The x-coordinate of the starting point for drawing the string.
   * @param y - The y-coordinate of the starting point for drawing the string.
   * @param str - The string to be drawn.
   * @param fgCol - The foreground color of the string.
   * @param bgCol - The background color of the string.
   */
  drawAt(x: number, y: number, str: string, fgCol: string, bgCol: string): void;
}
