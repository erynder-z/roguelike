import { GameIF } from '../../interfaces/Builder/Game';
import { Map } from '../../interfaces/Map/Map';
import { WorldPoint } from './WorldPoint';

/**
 * Represents the dungeon that holds all the maps in the game.
 */
export class Dungeon {
  level: number = 0;
  maps: Map[] = [];

  /**
   * Retrieves the current map of the dungeon based on the current level.
   * @param {GameIF} g - The game interface.
   * @returns {Map} The current map.
   */
  currentMap(g: GameIF): Map {
    return this.getLevel(this.level, g);
  }

  /**
   * Retrieves a specific level of the dungeon.
   * If the level does not exist, it is generated.
   * @param {number} l - The level number.
   * @param {GameIF} g - The game interface.
   * @returns {Map} The map of the specified level.
   */
  getLevel(l: number, g: GameIF): Map {
    if (!this.hasLevel(l)) {
      const map = g.build.makeLevel(g.rand, l);
      this.add(map, l);
    }
    return this.maps[l];
  }

  /**
   * Checks if the dungeon has a specific level.
   * @param {number} l - The level number to check.
   * @returns {boolean} True if the dungeon has the level, otherwise false.
   */
  hasLevel(l: number): boolean {
    return l < this.maps.length && !!this.maps[l];
  }

  /**
   * Adds a map to a specified level of the dungeon.
   * @param {Map} map - The map to add.
   * @param {number} l - The level number where the map should be added.
   * @returns {void}
   */
  add(map: Map, l: number): void {
    if (l >= this.maps.length) {
      this.extendMaps(l + 1);
    }
    this.maps[l] = map;
  }

  /**
   * Extends the maps array to a specified length.
   * @param {number} len - The new length of the maps array.
   * @returns {void}
   */
  extendMaps(len: number) {
    this.maps.length = len;
  }

  /**
   * Handles player switching levels within the dungeon.
   * @param {number} newLevel - The new level to which the player switches.
   * @param {WorldPoint} np - The new position of the player on the new level.
   * @param {GameIF} g - The game interface.
   * @returns {void}
   */
  playerSwitchLevel(newLevel: number, np: WorldPoint, g: GameIF): void {
    const player = g.player;
    this.currentMap(g).removeMob(player);
    this.level = newLevel;
    this.currentMap(g).enterMap(player, np);
  }
}
