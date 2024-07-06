import { GameMap } from '../MapModel/GameMap';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
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
  private static checkForMagnetismInArea(
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
  public static getMagneticDirection(
    map: MapIF,
    currentPosition: WorldPoint,
    newPosition: WorldPoint,
  ): WorldPoint | null {
    const magneticNeighbor = this.checkForMagnetismInArea(map, newPosition);
    return magneticNeighbor
      ? currentPosition.directionTo(magneticNeighbor)
      : null;
  }

  /**
   * Calculates the new position by adding the direction to the current position.
   *
   * @param {WorldPoint} currentPosition - The current position of the mob.
   * @param {WorldPoint} direction - The direction in which the mob is moving.
   * @return {WorldPoint} The new position after adding the direction to the current position.
   */
  public static calculateNewPosition(
    currentPosition: WorldPoint,
    direction: WorldPoint,
  ): WorldPoint {
    return currentPosition.plus(direction);
  }
  /**
   * Determines if the object should move towards the magnetic position.
   *
   * @param {GameMap} map - The game map representing the game world.
   * @param {WorldPoint} currentPosition - The current position of the object.
   * @param {WorldPoint} proposedNewPosition - The proposed new position.
   * @param {RandomGenerator} rand - The random generator.
   * @param {boolean} canGetStuckInWall - Whether the object can get stuck in a wall.
   * @return {WorldPoint | null} The direction to move towards if magnetism is found, otherwise null.
   */
  public static getMagnetizedPosition(
    map: GameMap,
    currentPosition: WorldPoint,
    proposedNewPosition: WorldPoint,
    rand: RandomGenerator,
    canGetStuckInWall: boolean = false,
  ): WorldPoint | null {
    const magneticNeighbor = this.checkForMagnetismInArea(
      map,
      proposedNewPosition,
    );

    if (magneticNeighbor) {
      const magneticDirection = currentPosition.directionTo(magneticNeighbor);
      const magneticMovePosition = currentPosition.plus(magneticDirection);
      const canMoveInDirection =
        canGetStuckInWall || !map.isBlocked(magneticMovePosition);

      if (rand.isOneIn(2) && canMoveInDirection) {
        return magneticDirection;
      }
    }

    return null;
  }
}
