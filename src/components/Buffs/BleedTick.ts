import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { Tick } from './Types/BuffType';

/**
 * Handles a bleed tick.
 */
export class BleedTick implements Tick {
  constructor(
    public mob: Mob,
    public game: GameState,
  ) {}

  /**
   * Executes a tick of the BurnTick class.
   * Deals 2-5 damage when not resting for 2 or more turns and 1 damage while resting.
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  public tick(time: number): void {
    if (time % 2) return;
    const resting = this.mob.sinceMove > 2;
    const dmg = resting ? 1 : this.game.rand.randomIntegerClosedRange(2, 5);
    if (this.mob.isPlayer) {
      const msg = new LogMessage(
        `You take ${dmg} damage because of the bleeding!`,
        EventCategory.playerDamage,
      );
      this.game.message(msg);
    }

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
