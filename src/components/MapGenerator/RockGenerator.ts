import { Rock } from './Types/Rock';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Glyph } from '../Glyphs/Glyph';
import { Tile } from './Types/Tile';

/**
 * Class for generating different rock types.
 */
export class RockGenerator {
  public static getWallRockTypes(rand: RandomGenerator, tile: Tile): Glyph {
    return this.getRandomGlyph(rand, tile.wall);
  }

  /**
   * Retrieves the floor rock types randomly based on the given random generator and tile.
   *
   * @param {RandomGenerator} rand - The random generator used to generate the random selection.
   * @param {Tile} tile - The tile object containing the floor information.
   * @return {Glyph} The randomly selected glyph.
   */
  public static getFloorRockTypes(rand: RandomGenerator, tile: Tile): Glyph {
    return this.getRandomGlyph(rand, tile.floor);
  }

  /**
   * Generates a random glyph from a list of rock types based on probability of occurrence.
   *
   * @param {RandomGenerator} rand - The random generator to use for randomness.
   * @param {Rock[]} rockTypes - The list of rock types with their probabilities.
   * @return {Glyph} The randomly selected glyph.
   */
  private static getRandomGlyph(
    rand: RandomGenerator,
    rockTypes: Rock[],
  ): Glyph {
    const totalPercentage = rockTypes.reduce(
      (sum, rt) => sum + rt.occurrencePercentage,
      0,
    );

    const randNum = rand.generateRandomNumber() * totalPercentage;

    let accumulatedPercentage = 0;
    for (const rockType of rockTypes) {
      accumulatedPercentage += rockType.occurrencePercentage;
      if (randNum < accumulatedPercentage) {
        return rockType.glyph;
      }
    }

    // Fallback in case no glyph is found, though this should never happen
    throw new Error(
      'Unable to select a rock glyph. Check the rock types and their probabilities.',
    );
  }
}
