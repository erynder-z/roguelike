import { GameIF } from '../Builder/Interfaces/GameIF';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { TickIF } from './Interfaces/BuffIF';

export class BurnTick implements TickIF {
  constructor(
    public mob: Mob,
    public game: GameIF,
  ) {}

  /**
   * Executes a tick of the BurnTick class.
   * Deals 2-4 damage every second turn
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  tick(time: number): void {
    if (time % 2) return;
    const dmg = this.game.rand.randomIntegerClosedRange(2, 4);
    if (this.mob.isPlayer) {
      const msg = new LogMessage(
        `You take ${dmg} damage because of the burn!`,
        EventCategory.playerDamage,
      );
      this.game.message(msg);
    }

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
