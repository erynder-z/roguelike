import { GameIF } from '../Builder/Interfaces/GameIF';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage, MessageCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { TickIF } from './Interfaces/BuffIF';

export class BleedTick implements TickIF {
  constructor(
    public mob: Mob,
    public game: GameIF,
  ) {}

  /**
   * Executes a tick of the BurnTick class.
   * Deals 2-5 damage when not resting for 2 or more turns and 1 damage while resting.
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  tick(time: number): void {
    if (time % 2) return;
    const resting = this.mob.sinceMove > 2;
    const dmg = resting ? 1 : this.game.rand.randomIntegerClosedRange(2, 5);
    if (this.mob.isPlayer) {
      const msg = new LogMessage(
        `You take ${dmg} damage because of the bleeding!`,
        MessageCategory.playerDamage,
      );
      this.game.message(msg);
    }

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
