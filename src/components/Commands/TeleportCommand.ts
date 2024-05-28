import { GameIF } from '../Builder/Interfaces/GameIF';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';

/**
 * Represents a command to teleport a mob to a random point within a specified radius.
 */
export class TeleportCommand extends CommandBase {
  constructor(
    private readonly radius: number,
    private readonly mob: Mob,
    private readonly gameInstance: GameIF,
  ) {
    super(mob, gameInstance);
  }

  /**
   * Executes the teleport command, moving the mob to a random teleport point within a given radius.
   *
   * @return {boolean} Returns true if the mob was successfully teleported, false otherwise.
   */
  execute(): boolean {
    const map = this.gameInstance.currentMap() as MapIF;
    const targetPoint = this.findTeleportPoint(this.mob.pos, this.radius, map);

    if (!targetPoint) return false;

    map.moveMob(this.mob, targetPoint);

    const message = new LogMessage(
      `${this.mob.name} teleports.`,
      EventCategory.teleport,
    );
    this.gameInstance.message(message);
    return true;
  }

   /**
    * Finds a teleport point within a given radius of a center point on the map.
    *
    * @param {WorldPoint} center - The center point on the map.
    * @param {number} radius - The radius within which to search for a teleport point.
    * @param {MapIF} map - The map on which to search for a teleport point.
    * @return {WorldPoint | null} The found teleport point or null if no valid point is found.
    */
   findTeleportPoint(
    center: WorldPoint,
    radius: number,
    map: MapIF,
  ): WorldPoint | null {
    const random = this.gameInstance.rand;
    const newPoint = new WorldPoint();

    for (let attempts = 15; attempts > 0; attempts--) {
      const deltaX = random.randomInteger(-radius, radius);
      const deltaY = random.randomInteger(-radius, radius);
      newPoint.x = center.x + deltaX;
      newPoint.y = center.y + deltaY;

      if (!map.isLegalPoint(newPoint) || map.isBlocked(newPoint)) {
        continue;
      }

      console.table({ newPoint, deltaX, deltaY });
      return newPoint;
    }
    return null;
  }
}
