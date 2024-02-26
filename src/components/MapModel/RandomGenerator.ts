import { WorldPoint } from './WorldPoint';

/**
 * Represents a random number generator.
 */
export class RandomNumberGenerator {
  /**
   * The seed used for generating random numbers.
   * @type {number}
   */
  private seed: number;

  /**
   * Creates an instance of RandomNumberGenerator.
   * @param {number} initialSeed - The initial seed for the generator.
   */
  constructor(
    initialSeed: number = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER),
  ) {
    this.seed = initialSeed;
  }

  /**
   * Gets the current seed of the generator.
   * @returns {number} The current seed.
   */
  getCurrentSeed(): number {
    return this.seed;
  }

  /**
   * Sets a new seed for the generator.
   * @param {number} newSeed - The new seed value.
   */
  setSeed(newSeed: number): void {
    this.seed = newSeed;
  }

  /**
   * Generates a random number.
   * @returns {number} A random number between 0 and 1.
   */
  generateRandomNumber(): number {
    const scaledRandom = Math.sin(this.seed++) * 10000;
    return scaledRandom - Math.floor(scaledRandom);
  }
}

/**
 * Represents a wrapper for a random number generator with additional utility methods.
 */
export class RandomNumberGeneratorWrapper extends RandomNumberGenerator {
  /**
   * Generates a random integer within the specified range.
   * @param {number} lower - The lower bound of the range.
   * @param {number} [higher=0] - The upper bound of the range.
   * @returns {number} A random integer within the specified range.
   */
  randomInteger(lower: number, higher: number = 0): number {
    if (!higher) {
      higher = lower;
      lower = 0;
    }
    if (lower > higher) {
      const swap = lower;
      lower = higher;
      higher = swap;
    }
    const range = higher - lower;
    const draw = this.generateRandomNumber() * range;
    const roll = Math.floor(draw) + lower;
    return roll;
  }

  /**
   * Generates a random integer within the closed range [lower, higher].
   * @param {number} lower - The lower bound of the range.
   * @param {number} higher - The upper bound of the range.
   * @returns {number} A random integer within the closed range [lower, higher].
   */
  randomIntegerClosedRange(lower: number, higher: number): number {
    return this.randomInteger(lower, higher + 1);
  }

  /**
   * Checks if a random integer from 0 to N-1 equals 0.
   * @param {number} N - The number to check against.
   * @returns {boolean} true if a random integer from 0 to N-1 equals 0, otherwise false.
   */
  isOneIn(N: number): boolean {
    return this.randomInteger(N) == 0;
  }
}

/**
 * Represents a random generator extending the RandomNumberGeneratorWrapper class.
 */
export class RandomGenerator extends RandomNumberGeneratorWrapper {
  /**
   * Generates a random direction for forced movement. Never returns 0,0, to prevent returning the same world point the mob is currently at.
   * @returns {WorldPoint} A random direction represented as a WorldPoint object.
   */
  randomDirectionForcedMovement(): WorldPoint {
    const a = this.randomIntegerClosedRange(-1, 1);
    const b = this.isOneIn(2) ? 1 : -1;
    const h = this.isOneIn(2);
    return new WorldPoint(h ? a : b, h ? b : a);
  }

  /**
   * Generates a random WorldPoint representing a random direction.
   *
   * @return {WorldPoint} the randomly generated WorldPoint
   */
  randomDirection0(): WorldPoint {
    return new WorldPoint(
      this.randomIntegerClosedRange(-1, 1),
      this.randomIntegerClosedRange(-1, 1),
    );
  }

  /**
   * Generates a new WorldPoint object representing a random direction from the given WorldPoint.
   *
   * @param {WorldPoint} p - (Optional) The starting WorldPoint. Defaults to a new WorldPoint.
   * @return {WorldPoint} A new WorldPoint object representing the random direction.
   */
  randomDirection(p: WorldPoint = new WorldPoint()): WorldPoint {
    return new WorldPoint(
      p.x + this.randomIntegerClosedRange(-1, 1),
      p.y + this.randomIntegerClosedRange(-1, 1),
    );
  }
}
