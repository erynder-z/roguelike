import { GameIF } from '../Builder/Interfaces/GameIF';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage, MessageCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { TickIF } from './Interfaces/BuffIF';

export class PoisonTick implements TickIF {
  constructor(
    public mob: Mob,
    public game: GameIF,
  ) {}

  /**
   * Executes a tick of the PoisonTick class.
   *  Deals 1 damage every second turn
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  tick(time: number): void {
    if (time % 2) return;
    const dmg = 1;
    if (this.mob.isPlayer) {
      const msg = new LogMessage(
        `You take ${dmg} damage because of the poison!`,
        MessageCategory.playerDamage,
      );
      this.game.message(msg);
    }

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
