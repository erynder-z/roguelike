import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';
/**
 * Utility class for handling magnetism.
 */
export class MagnetismHandler {
  /**
   * Checks for magnetism in the map at a given position and returns the first magnetic neighbor if found.
   *
   * @param {MapIF} map - The map interface representing the game world.
   * @param {WorldPoint} position - The position to check for magnetism.
   * @return {WorldPoint | null} The WorldPoint of the magnetic neighbor if found, otherwise null.
   */
  private static checkForMagnetism(
    map: MapIF,
    position: WorldPoint,
  ): WorldPoint | null {
    const neighbors = position.getNeighbors(3);

    for (const neighbor of neighbors) {
      if (neighbor.isPositionOutOfBounds(neighbor, map)) {
        continue;
      }

      const cell = map.cell(neighbor);
      if (cell?.isMagnetic()) {
        return neighbor;
      }
    }
    return null;
  }

  /**
   * Calculates the magnetic direction based on the given map and position.
   *
   * @param {MapIF} map - The map object representing the game world.
   * @param {WorldPoint} currentPosition - The current position of object to calculate the magnetic direction for.
   * @param {WorldPoint} newPosition - The position to calculate the magnetic direction for.
   * @return {WorldPoint | null} The calculated magnetic direction, or null if there is no magnetism.
   */
  static getMagnetDirection(
    map: MapIF,
    currentPosition: WorldPoint,
    newPosition: WorldPoint,
  ): WorldPoint | null {
    const magneticPosition = MagnetismHandler.checkForMagnetism(
      map,
      newPosition,
    );
    return this.getMagnetismDirection(currentPosition, magneticPosition);
  }

  /**
   * Calculates the direction from the mob's position to the magnetic position.
   *
   * @param {WorldPoint} currentPosition - The position of the object to calculate the direction from.
   * @param {WorldPoint | null} magnetPos - The position of the magnetic neighbor, can be null.
   * @return {WorldPoint | null} The direction from the mob to the magnetic position, or null if no magnetic neighbor found.
   */
  private static getMagnetismDirection(
    currentPosition: WorldPoint,
    magnetPos: WorldPoint | null,
  ): WorldPoint | null {
    return magnetPos ? currentPosition.directionTo(magnetPos) : null;
  }
}
