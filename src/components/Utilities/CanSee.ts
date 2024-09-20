import { BresenhamIterator } from './BresenhamIterator';
import { GameState } from '../Builder/Types/GameState';
import { Map } from '../MapModel/Types/Map';
import { Mob } from '../Mobs/Mob';
import { WorldPoint } from '../MapModel/WorldPoint';

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
  public static checkPointLOS_Bresenham(
    a: WorldPoint,
    b: WorldPoint,
    map: Map,
    onlyEnv: boolean,
  ): boolean {
    const i: BresenhamIterator = BresenhamIterator.createFromWorldPoint(a, b);
    for (; !i.done(); ) {
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
  public static checkMobLOS_Bresenham(
    a: Mob,
    b: Mob,
    map: Map,
    onlyEnv: boolean,
  ): boolean {
    return this.checkPointLOS_Bresenham(a.pos, b.pos, map, onlyEnv);
  }

  /**
   * Performs raycasting to determine line of sight between two points on the map.
   * @param {WorldPoint} start - The starting point of the LOS check.
   * @param {WorldPoint} end - The ending point of the LOS check.
   * @param {Map} map - The map object.
   * @returns {boolean} - True if there is line of sight, otherwise false.
   */
  public static checkPointLOS_RayCast(
    start: WorldPoint,
    end: WorldPoint,
    map: Map,
  ): boolean {
    // Get the differences in coordinates between the start and end points
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    // Determine the direction of movement for the ray (1 or -1)
    const sx = start.x < end.x ? 1 : -1;
    const sy = start.y < end.y ? 1 : -1;

    // Error accumulator for adjusting the y coordinate when moving in the x direction
    let err = dx - dy;

    // Current position of the ray
    let x = start.x;
    let y = start.y;

    // Perform raycasting
    while (x !== end.x || y !== end.y) {
      // Check if the current position is inside the map bounds
      if (!map.isLegalPoint(new WorldPoint(x, y))) {
        return false; // Hit map boundary, LOS blocked
      }

      // Check if the current cell blocks LOS
      const cell = map.cell(new WorldPoint(x, y));
      if (cell.isOpaque()) {
        return false; // Cell blocks LOS
      }

      // Adjust the position of the ray based on the error accumulator
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    // No obstacles encountered, LOS is clear
    return true;
  }

  /**
   * Checks if the distance between two points is smaller than a provided threshold.
   * @param {WorldPoint} a - The first point.
   * @param {WorldPoint} b - The second point.
   * @param {number} threshold - The maximum allowed distance.
   * @returns {boolean} - True if the distance is smaller than the threshold, otherwise false.
   */
  public static isDistanceSmallerThan(
    a: WorldPoint,
    b: WorldPoint,
    threshold: number,
  ): boolean {
    return a.squaredDistanceTo(b) <= threshold;
  }

  /**
   * Calculates the far distance for visibility based on player position, map, and game state.
   *
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {Map} map - The current map.
   * @param {GameState} game - The game state containing player stats.
   * @return {number} The calculated far distance for visibility.
   */
  public static getFarDist(
    playerPos: WorldPoint,
    map: Map,
    game: GameState,
  ): number {
    const glowRange = 10;
    const maxVisibilityRange = 75;
    let farDist = game.stats.currentVisRange || 50;

    const glowingRocks = this.countLightSources(playerPos, map, glowRange);
    farDist *= Math.pow(2, glowingRocks);

    return Math.min(farDist, maxVisibilityRange);
  }

  /**
   * Counts the number of light sources in the vicinity of the player position within a specified diameter.
   *
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {Map} map - The current map.
   * @param {number} diameter - The diameter within which to count light sources.
   * @return {number} The count of light sources in the specified vicinity.
   */
  private static countLightSources(
    playerPos: WorldPoint,
    map: Map,
    diameter: number,
  ): number {
    let lightSources = 0;
    for (const neighbor of playerPos.getNeighbors(diameter * 0.5)) {
      if (map.isLegalPoint(neighbor) && map.cell(neighbor).isGlowing()) {
        lightSources++;
      }
    }
    return lightSources;
  }
}
