import { Glyph } from '../Glyphs/Glyph';
import { Map } from '../MapModel/Types/Map';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Utility class for finding an unoccupied space on a map.
 */
export class FindFreeSpace {
  /**
   * Finds a free space on the map.
   * @param {Map} map - The map on which to find free space.
   * @param {RandomGenerator} rand - The random generator to use for finding free space.
   * @returns {WorldPoint | null} A WorldPoint representing the free space found, or null if no free space is available.
   */
  public static findFree(map: Map, rand: RandomGenerator): WorldPoint {
    return this.find(Glyph.Floor, map, rand);
  }

  /**
   * Finds a specified character in the map and returns its position.
   * @param {Glyph} char - The character to find.
   * @param {Map} map - The map in which to search for the character.
   * @param {RandomGenerator} rand - The random generator to use for finding the character.
   * @returns {WorldPoint } A WorldPoint representing the position of the character found.
   * @throws {string} Throws an error if no free space is found.
   */
  public static find(char: Glyph, map: Map, rand: RandomGenerator): WorldPoint {
    const e = new WorldPoint(map.dimensions.x - 2, map.dimensions.y - 2);
    const s = new WorldPoint(
      rand.randomIntegerClosedRange(1, e.x),
      rand.randomIntegerClosedRange(1, e.y),
    );
    for (let p = s.copy(); ; ) {
      const cell = map.cell(p);
      if (cell.env === char && !cell.mob) {
        return p;
      }
      ++p.x;
      if (p.x > e.x) {
        p.x = 1;
        ++p.y;
        if (p.y > e.y) {
          p.y = 1;
        }
        if (p.isEqual(s)) {
          throw 'No free space found';
        }
      }
    }
  }
}
