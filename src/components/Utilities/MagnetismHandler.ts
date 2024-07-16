import { GameMap } from '../MapModel/GameMap';
import { Map } from '../MapModel/Types/Map';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Utility class for handling magnetism.
 */
export class MagnetismHandler {
  /**
   * Checks for magnetism in the map at a given position and returns the first magnetic neighbor if found.
   *
   * @param {Map} map - The game map representing the game world.
   * @param {WorldPoint} position - The position to check for magnetism.
   * @return {WorldPoint | null} The WorldPoint of the magnetic neighbor if found, otherwise null.
   */
  private static checkForMagnetismInArea(
    map: Map,
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
