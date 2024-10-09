/**
 * Represents a point in a terminal grid with x and y coordinates.
 */
export class TerminalPoint {
  constructor(
    public x: number = 0,
    public y: number = 0,
  ) {}

  /**
   * A static method that creates a TerminalPoint instance with stock dimensions (32, 16).
   * @returns A TerminalPoint instance with x-coordinate 32 and y-coordinate 16.
   */
  public static TerminalDimensions = new TerminalPoint(64, 32);
  public static MapDimensions = new TerminalPoint(96, 48);
}
