import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents an iterator for generating points along a line using Bresenham's algorithm.
 */
export class BresenhamIterator {
  /**
   * Array to store generated points.
   */
  pixels: WorldPoint[] = [];

  /**
   * Counter for iteration.
   */
  i: number = 0;

  /**
   * Length of the longest side.
   */
  longest: number = 0;

  /**
   * Length of the shortest side.
   */
  shortest: number = 0;

  /**
   * Incremental change along the x-axis for the first step.
   */
  dx1: number = 0;

  /**
   * Incremental change along the y-axis for the first step.
   */
  dy1: number = 0;

  /**
   * Incremental change along the x-axis for the second step.
   */
  dx2: number = 0;

  /**
   * Incremental change along the y-axis for the second step.
   */
  dy2: number = 0;

  /**
   * Numerator used in Bresenham's algorithm.
   */
  numerator: number = 0;

  /**
   * Current x-coordinate.
   */
  x: number = 0;

  /**
   * Current y-coordinate.
   */
  y: number = 0;

  /**
   * Checks if the iteration is complete.
   * @returns {boolean} - True if the iteration is complete, otherwise false.
   */
  done(): boolean {
    return !(this.i <= this.longest);
  }

  /**
   * Iterates through all points along the line.
   */
  iterAll1(): void {
    for (this.i = 0; this.i < this.longest; this.i++) {
      this.next();
    }
  }

  /**
   * Iterates through all points along the line.
   */
  iterAll2(): void {
    let p: WorldPoint;

    do {
      p = this.next();
    } while (!this.done());

    console.log(p); // Logging the last point after iteration completion
  }

  /**
   * Initializes a BresenhamIterator instance with two WorldPoint objects.
   * @param {WorldPoint} p1 - The starting point.
   * @param {WorldPoint} p2 - The ending point.
   * @returns {BresenhamIterator} - A BresenhamIterator instance.
   */
  public static BresIter1(p1: WorldPoint, p2: WorldPoint): BresenhamIterator {
    return new BresenhamIterator().init(p1.x, p1.y, p2.x, p2.y);
  }

  /**
   * Initializes a BresenhamIterator instance with coordinates.
   * @param {number} x1 - The x-coordinate of the starting point.
   * @param {number} y1 - The y-coordinate of the starting point.
   * @param {number} x2 - The x-coordinate of the ending point.
   * @param {number} y2 - The y-coordinate of the ending point.
   * @returns {BresenhamIterator} - A BresenhamIterator instance.
   */
  public static BresIter2(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): BresenhamIterator {
    return new BresenhamIterator().init(x1, y1, x2, y2);
  }

  /**
   * Initializes the iterator with coordinates.
   * @param {number} x1 - The x-coordinate of the starting point.
   * @param {number} y1 - The y-coordinate of the starting point.
   * @param {number} x2 - The x-coordinate of the ending point.
   * @param {number} y2 - The y-coordinate of the ending point.
   * @returns {BresenhamIterator} - The updated BresenhamIterator instance.
   */
  init(x1: number, y1: number, x2: number, y2: number): BresenhamIterator {
    this.x = x1;
    this.y = y1;
    const dx = x2 - x1;
    const dy = y2 - y1;
    this.dx1 = dx > 0 ? 1 : dx < 0 ? -1 : 0;
    this.dy1 = dy > 0 ? 1 : dy < 0 ? -1 : 0;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    this.longest = absDy > absDx ? absDy : absDx;
    this.shortest = absDx > absDy ? absDx : absDy;

    this.dx2 = this.longest === absDy ? -this.dx1 : 0;
    this.dy2 = this.longest === absDy ? (dy > 0 ? -1 : 1) : this.dy1;

    this.numerator = Math.floor(this.longest / 2);
    this.i = 0;
    return this;
  }

  /**
   * Generates the next point in the iteration.
   * @returns {WorldPoint} - The next point in the iteration.
   */
  public next(): WorldPoint {
    const currentPoint: WorldPoint = new WorldPoint(this.x, this.y);
    this.pixels.push(currentPoint);
    this.numerator += this.shortest;
    if (!(this.numerator < this.longest)) {
      this.numerator -= this.longest;
      this.x += this.dx1;
      this.y += this.dy1;
    } else {
      this.x += this.dx2;
      this.y += this.dy2;
    }
    ++this.i;
    return currentPoint;
  }
}
