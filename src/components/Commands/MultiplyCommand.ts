import { GameIF } from '../Builder/Interfaces/GameIF';
import { GameMap } from '../MapModel/GameMap';
import { WorldPoint } from '../MapModel/WorldPoint';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { CommandBase } from './CommandBase';

/**
 * Represents a command that multiplies a mob.
 */
export class MultiplyCommand extends CommandBase {
  constructor(
    public me: Mob,
    public g: GameIF,
  ) {
    super(me, g);
  }
  /**
   * Executes the command.
   *
   * @return {boolean} Returns true if the command is executed successfully, otherwise false.
   */
  public execute(): boolean {
    const g = this.g;
    const rnd = g.rand;
    const map = <GameMap>g.currentMap();
    const p = this.find(map, rnd);

    if (p == null) return true;

    this.spawnMob(p, map, g);
    return true;
  }

  /**
   * Spawns a mob at the given world point on the specified game map.
   *
   * @param {WorldPoint} p - The coordinates of the world point where the mob should be spawned.
   * @param {GameMap} map - The game map on which the mob should be spawned.
   * @param {GameIF} g - The game interface.
   * @return {void} This function does not return a value.
   */
  public spawnMob(p: WorldPoint, map: GameMap, g: GameIF): void {
    const m = this.me;
    const b = g.build;

    b.addNPC(m.glyph, p.x, p.y, map, m.level);

    const msg = new LogMessage(
      `${m.name} is multiplying!`,
      EventCategory.mobSpawn,
    );
    g.message(msg);
  }

  /**
   * Finds a valid world point on the game map to spawn a mob.
   *
   * @param {GameMap} map - The game map to search for a valid spawn point.
   * @param {RandomGenerator} rnd - The random number generator to use for picking a spawn point.
   * @return {WorldPoint | null} The valid world point to spawn a mob, or null if no valid spawn point is found.
   */
  private find(map: GameMap, rnd: RandomGenerator): WorldPoint | null {
    const pos = this.me.pos;
    const c: WorldPoint[] = [];
    const a = new WorldPoint();

    for (a.y = -1; a.y <= 1; ++a.y) {
      for (a.x = -1; a.x <= 1; ++a.x) {
        const b = pos.plus(a);
        if (!map.isBlocked(b)) c.push(b);
      }
    }
    return this.pick(c, rnd);
  }

  /**
   * Picks a random element from the given array of WorldPoints using the provided RandomGenerator.
   *
   * @param {WorldPoint[]} c - The array of WorldPoints to pick from.
   * @param {RandomGenerator} rnd - The RandomGenerator used to generate a random index.
   * @return {WorldPoint | null} The randomly picked WorldPoint, or null if the array is empty.
   */
  private pick(c: WorldPoint[], rnd: RandomGenerator): WorldPoint | null {
    if (c.length == 0) return null;
    const index = rnd.randomInteger(c.length);
    return c[index];
  }
}
