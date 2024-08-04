import { CommandBase } from './CommandBase';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { Map } from '../MapModel/Types/Map';
import { Mob } from '../Mobs/Mob';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command to teleport a mob to a random point within a specified radius.
 */
export class TeleportCommand extends CommandBase {
  constructor(
    public radius: number,
    public mob: Mob,
    public game: GameState,
  ) {
    super(mob, game);
  }

  /**
   * Executes the teleport command, moving the mob to a random teleport point within a given radius.
   *
   * @return {boolean} Returns true if the mob was successfully teleported, false otherwise.
   */
  public execute(): boolean {
    const map = this.game.currentMap() as Map;
    const targetPoint = this.findTeleportPoint(this.mob.pos, this.radius, map);

    if (!targetPoint) return false;

    map.moveMob(this.mob, targetPoint);

    const message = new LogMessage(
      `${this.mob.name} teleports.`,
      EventCategory.teleport,
    );
    this.game.message(message);

    return true;
  }

  /**
   * Finds a teleport point within a given radius of a center point on the map.
   *
   * @param {WorldPoint} center - The center point on the map.
   * @param {number} radius - The radius within which to search for a teleport point.
   * @param {Map} map - The map on which to search for a teleport point.
   * @return {WorldPoint | null} The found teleport point or null if no valid point is found.
   */
  private findTeleportPoint(
    center: WorldPoint,
    radius: number,
    map: Map,
  ): WorldPoint | null {
    const random = this.game.rand;
    const newPoint = new WorldPoint();

    for (let attempts = 15; attempts > 0; attempts--) {
      const deltaX = random.randomInteger(-radius, radius);
      const deltaY = random.randomInteger(-radius, radius);
      newPoint.x = center.x + deltaX;
      newPoint.y = center.y + deltaY;

      if (
        (map.isLegalPoint(newPoint) &&
          map.cell(newPoint).env === Glyph.ChasmEdge) ||
        (map.isLegalPoint(newPoint) &&
          map.cell(newPoint).env === Glyph.ChasmCenter)
      )
        return newPoint;

      if (!map.isLegalPoint(newPoint) || map.isBlocked(newPoint)) {
        continue;
      }

      console.table({ newPoint, deltaX, deltaY });
      return newPoint;
    }
    return null;
  }
}
