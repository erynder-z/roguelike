import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { Tick } from './Types/BuffType';

/**
 * Handles a petrify tick.
 */
export class PetrifyTick implements Tick {
  constructor(
    public mob: Mob,
    public game: GameState,
  ) {}

  /**
   * Executes a tick of the FreezeTick class.
   * Deals gradually increasing damage every second turn if not moving for 2 or more turns.
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  public tick(time: number): void {
    if (time % 2) return;
    const sinceLastMove = this.mob.sinceMove;
    if (sinceLastMove < 2) return;
    const dmg = this.game.rand.randomIntegerClosedRange(
      sinceLastMove,
      sinceLastMove * 2,
    );
    if (this.mob.isPlayer) {
      const msg = new LogMessage(
        `You are being petrified and take ${dmg} damage!`,
        EventCategory.playerDamage,
      );
      this.game.message(msg);
    }

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
