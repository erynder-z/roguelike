import { Rock } from './Types/Rock';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Glyph } from '../Glyphs/Glyph';
import { Tile } from './Types/Tile';

/**
 * Class for generating different rock types.
 */
export class RockGenerator {
  public static getWallRockTypes(rnd: RandomGenerator, tile: Tile): Glyph {
    return this.getRandomGlyph(rnd, tile.wall);
  }

  /**
   * Retrieves the floor rock types randomly based on the given random generator and tile.
   *
   * @param {RandomGenerator} rnd - The random generator used to generate the random selection.
   * @param {Tile} tile - The tile object containing the floor information.
   * @return {Glyph} The randomly selected glyph.
   */
  public static getFloorRockTypes(rnd: RandomGenerator, tile: Tile): Glyph {
    return this.getRandomGlyph(rnd, tile.floor);
  }

  /**
   * Generates a random glyph from a list of rock types based on probability of occurrence.
   *
   * @param {RandomGenerator} rnd - The random generator to use for randomness.
   * @param {Rock[]} rockTypes - The list of rock types with their probabilities.
   * @return {Glyph} The randomly selected glyph.
   */
  private static getRandomGlyph(
    rnd: RandomGenerator,
    rockTypes: Rock[],
  ): Glyph {
    const totalPercentage = rockTypes.reduce(
      (sum, rt) => sum + rt.occurrencePercentage,
      0,
    );

    const randNum = rnd.generateRandomNumber() * totalPercentage;

    let accumulatedPercentage = 0;
    for (const rockType of rockTypes) {
      accumulatedPercentage += rockType.occurrencePercentage;
      if (randNum < accumulatedPercentage) {
        return rockType.glyph;
      }
    }

    return rockTypes[0].glyph;
  }
}
