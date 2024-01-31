/**
 * Represents a point in a terminal grid with x and y coordinates.
 */
export class TerminalPoint {
  /**
   * Creates a new instance of TerminalPoint.
   * @param x - The x-coordinate of the terminal point.
   * @param y - The y-coordinate of the terminal point.
   */
  constructor(
    public x: number,
    public y: number,
  ) {}

  /**
   * A static method that creates a TerminalPoint instance with stock dimensions (32, 16).
   * @returns A TerminalPoint instance with x-coordinate 32 and y-coordinate 16.
   */
  static createStockDimensions(): TerminalPoint {
    return new TerminalPoint(32, 16);
  }
}
