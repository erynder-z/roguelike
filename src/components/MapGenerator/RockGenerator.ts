import { Rock } from './Types/Rock';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Glyph } from '../Glyphs/Glyph';

/**
 * Class for generating different rock types.
 */
export class RockGenerator {
  /**
   * Generates a random rock type based on probability of occurrence.
   *
   * @param {RandomGenerator} rnd - The random generator to use for randomness.
   * @return {Glyph} The randomly selected glyph representing a rock type.
   */

  public static getRandomRockType(rnd: RandomGenerator): Glyph {
    const rockTypes: Rock[] = [
      { glyph: Glyph.Wall, percentage: 100 },
      { glyph: Glyph.Rock, percentage: 10 },
      { glyph: Glyph.Obsidian, percentage: 5 },
      { glyph: Glyph.Magnetite, percentage: 1 },
      { glyph: Glyph.SpikyCrystal, percentage: 10 },
    ];

    const totalPercentage = rockTypes.reduce(
      (sum, rt) => sum + rt.percentage,
      0,
    );

    const randNum = rnd.generateRandomNumber() * totalPercentage;

    let accumulatedPercentage = 0;
    for (const rockType of rockTypes) {
      accumulatedPercentage += rockType.percentage;
      if (randNum < accumulatedPercentage) {
        return rockType.glyph;
      }
    }
    return Glyph.Wall;
  }
}
