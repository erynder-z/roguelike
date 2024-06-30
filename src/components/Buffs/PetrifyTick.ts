import { GameIF } from '../Builder/Interfaces/GameIF';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { TickIF } from './Interfaces/BuffIF';

/**
 * Handles a petrify tick.
 */
export class PetrifyTick implements TickIF {
  constructor(
    public mob: Mob,
    public game: GameIF,
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
