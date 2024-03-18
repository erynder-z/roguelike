import { Map } from '../MapModel/Interfaces/Map';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { BresenhamIterator } from './BresenhamIterator';

/**
 * Provides methods to check visibility between points or entities on a map.
 */
export class CanSee {
  /**
   * Checks if there is a line of sight between two world points on the map.
   * @param {WorldPoint} a - The starting point.
   * @param {WorldPoint} b - The ending point.
   * @param {Map} map - The map object.
   * @param {boolean} onlyEnv - Indicates whether to consider only environmental obstacles.
   * @returns {boolean} - True if there is a line of sight, otherwise false.
   */
  public static canSee(
    a: WorldPoint,
    b: WorldPoint,
    map: Map,
    onlyEnv: boolean,
  ): boolean {
    const i: BresenhamIterator = BresenhamIterator.BresIter1(a, b);
    for (; i.done(); ) {
      const p: WorldPoint = i.next();
      const cell = map.cell(p);
      if (cell.isOpaque()) return false;
    }
    return true;
  }

  /**
   * Checks if there is a line of sight between two mobs on the map.
   * @param {Mob} a - The first mob.
   * @param {Mob} b - The second mob.
   * @param {Map} map - The map object.
   * @param {boolean} onlyEnv - Indicates whether to consider only environmental obstacles.
   * @returns {boolean} - True if there is a line of sight, otherwise false.
   */
  public static canSee2(a: Mob, b: Mob, map: Map, onlyEnv: boolean): boolean {
    return this.canSee(a.pos, b.pos, map, onlyEnv);
  }
}
