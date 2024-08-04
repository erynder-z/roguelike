import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { GameMap } from '../MapModel/GameMap';
import { Mob } from '../Mobs/Mob';
import { MultiplyCommand } from './MultiplyCommand';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command that spawns a mob.
 */
export class SummonCommand extends MultiplyCommand {
  constructor(
    public me: Mob,
    public game: GameState,
  ) {
    super(me, game);
  }
  /**
   * Spawns a mob at the given world point on the specified game map.
   *
   * @param {WorldPoint} wp - The coordinates of the world point where the mob should be spawned.
   * @param {GameMap} map - The game map on which the mob should be spawned.
   * @param {GameState} game - The game object.
   * @return {void} This function does not return a value.
   */
  public spawnMob(wp: WorldPoint, map: GameMap, game: GameState): void {
    const { me } = this;
    const { build } = game;

    const spawn = build.addMapLevel_Mob(wp, map, game.rand);
    const msg = new LogMessage(
      `${me.name} summons ${spawn}`,
      EventCategory.mobSpawn,
    );
    game.message(msg);
  }
}
