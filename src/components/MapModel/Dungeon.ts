import { GameIF } from '../Builder/Interfaces/GameIF';
import { MapIF } from './Interfaces/MapIF';
import { WorldPoint } from './WorldPoint';

/**
 * Represents the dungeon that holds all the maps in the game.
 */
export class Dungeon {
  public level: number = 0;
  public maps: MapIF[] = [];

  /**
   * Retrieves the current map of the dungeon based on the current level.
   * @param {GameIF} g - The game interface.
   * @returns {MapIF} The current map.
   */
  public currentMap(g: GameIF): MapIF {
    return this.getLevel(this.level, g);
  }

  /**
   * Retrieves a specific level of the dungeon.
   * If the level does not exist, it is generated.
   * @param {number} l - The level number.
   * @param {GameIF} g - The game interface.
   * @returns {MapIF} The map of the specified level.
   */
  public getLevel(l: number, g: GameIF): MapIF {
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
  private hasLevel(l: number): boolean {
    return l < this.maps.length && !!this.maps[l];
  }

  /**
   * Adds a map to a specified level of the dungeon.
   * @param {MapIF} map - The map to add.
   * @param {number} l - The level number where the map should be added.
   * @returns {void}
   */
  private add(map: MapIF, l: number): void {
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
  private extendMaps(len: number): void {
    this.maps.length = len;
  }

  /**
   * Handles player switching levels within the dungeon.
   * @param {number} newLevel - The new level to which the player switches.
   * @param {WorldPoint} np - The new position of the player on the new level.
   * @param {GameIF} g - The game interface.
   * @returns {void}
   */
  public playerSwitchLevel(newLevel: number, np: WorldPoint, g: GameIF): void {
    const player = g.player;
    this.currentMap(g).removeMob(player);
    this.level = newLevel;
    this.currentMap(g).enterMap(player, np);
  }
}
