import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a random number generator.
 */
export class RandomNumberGenerator {
  /**
   * Creates an instance of RandomNumberGenerator.
   * @param {number} initialSeed - The initial seed for the generator.
   */
  constructor(public seed: number) {}

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
    this.seed = (this.seed * 9301 + 49297) % 233280;
    const rn = this.seed / 233280;
    return rn;
  }
}

/**
 * Represents a wrapper for a random number generator with additional utility methods.
 */
export class RandomNumberGeneratorBase extends RandomNumberGenerator {
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
export class RandomGenerator extends RandomNumberGeneratorBase {
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

  /**
   * Increases the difficulty level by applying random adjustments.
   * @param {number} level - The current difficulty level.
   * @returns {number} The adjusted difficulty level.
   */
  adjustLevel(level: number): number {
    if (this.isOneIn(3)) {
      const delta = this.isOneIn(3) ? -1 : 1;
      level = this.adjustLevelByDelta(level + delta, delta);

      if (level < 1) level = 0;
    }
    return level;
  }

  /**
   * Adjusts the level based on a random delta value.
   * @param {number} level - The current level.
   * @param {number} delta - The adjustment delta.
   * @returns {number} The adjusted level.
   */
  adjustLevelByDelta(level: number, delta: number): number {
    return this.isOneIn(4)
      ? this.adjustLevelByDelta(level + delta, delta)
      : level;
  }

  /**
   * Determines if a success event occurred based on the given rate.
   *
   * @param {number} rate - The rate at which a success event occurs.
   * @return {boolean} Returns true if a success event occurred, false otherwise.
   */
  determineSuccess(rate: number): boolean {
    return this.randomInteger(100) < rate;
  }
}
