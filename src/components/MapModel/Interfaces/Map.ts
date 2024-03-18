import { MapCell } from '../MapCell';
import { WorldPoint } from '../WorldPoint';
import { Mob } from '../../Mobs/Mob';
import { TurnQueue } from '../../TurnQueue/TurnQueue';
import { ItemObject } from '../../ItemObjects/ItemObject';

/**
 * Represents a game map with cells and dimensions.
 */
export interface Map {
  /**
   * The dimensions of the map.
   */
  dimensions: WorldPoint;
  /**
   * Retrieves the cell at the specified world point.
   * @param {WorldPoint} p - The world point to retrieve the cell for.
   * @returns {MapCell} The map cell at the specified world point.
   */
  cell(p: WorldPoint): MapCell;

  /**
   * Checks if the specified world point is legal on the map.
   * @param {WorldPoint} p - The world point to check.
   * @returns {boolean} True if the point is legal, false otherwise.
   */
  isLegalPoint(p: WorldPoint): boolean;

  /**
   * The map level.
   */
  level: number;

  queue: TurnQueue;
  addNPC(m: Mob): Mob;

  enterMap(player: Mob, np: WorldPoint): void;

  moveMob(m: Mob, p: WorldPoint): void;

  removeMob(m: Mob): void;

  isBlocked(p: WorldPoint): boolean;

  addObject(o: ItemObject, p: WorldPoint): void;
}
