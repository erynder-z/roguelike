import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { Tick } from './Types/BuffType';

/**
 * Handles a poison tick.
 */
export class PoisonTick implements Tick {
  constructor(
    public mob: Mob,
    public game: GameState,
  ) {}

  /**
   * Executes a tick of the PoisonTick class.
   *  Deals 1 damage every second turn
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  public tick(time: number): void {
    if (time % 2) return;
    const dmg = 1;
    if (this.mob.isPlayer) {
      const msg = new LogMessage(
        `You take ${dmg} damage because of the poison!`,
        EventCategory.playerDamage,
      );
      this.game.message(msg);
    }

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
