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

  /**
   * Check if the x and y values are both zero.
   *
   * @return {boolean} true if both x and y are zero, false otherwise
   */
  isEmpty(): boolean {
    return this.x === 0 && this.y === 0;
  }

  /**
   * A method to add a WorldPoint to the current instance.
   *
   * @param {WorldPoint} p - the WorldPoint to add
   * @return {WorldPoint} the resulting WorldPoint after addition
   */
  plus(p: WorldPoint): WorldPoint {
    return this.copy().addTo(p);
  }

  /**
   * Copies the current WorldPoint.
   *
   * @return {WorldPoint} a new WorldPoint with the same coordinates as the current one
   */
  copy(): WorldPoint {
    return new WorldPoint(this.x, this.y);
  }

  /**
   * Adds the coordinates of the given WorldPoint to the current WorldPoint.
   *
   * @param {WorldPoint} b - The WorldPoint to add to the current point
   * @return {WorldPoint} The updated WorldPoint after adding the given point
   */
  addTo(b: WorldPoint): WorldPoint {
    this.x += b.x;
    this.y += b.y;
    return this;
  }

  /**
   * Set the x and y coordinates to the values of the given WorldPoint.
   *
   * @param {WorldPoint} n - the WorldPoint object with the new x and y coordinates
   * @return {void}
   */
  set(n: WorldPoint): void {
    this.x = n.x;
    this.y = n.y;
  }

  static StockDimensions = new WorldPoint(
    TerminalPoint.StockDimensions.x,
    TerminalPoint.StockDimensions.y,
  );
}
