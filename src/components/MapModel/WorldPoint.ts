import { TerminalPoint } from '../Terminal/TerminalPoint';

/**
 * Represents a point in the world with x and y coordinates.
 */
export class WorldPoint {
  constructor(
    /**
     * The x-coordinate of the world point.
     */
    public x: number = 0,
    /**
     * The y-coordinate of the world point.
     */
    public y: number = 0,
  ) {}

  static StockDimensions = new WorldPoint(
    TerminalPoint.StockDimensions.x,
    TerminalPoint.StockDimensions.y,
  );
}
