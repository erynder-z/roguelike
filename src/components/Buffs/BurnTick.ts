import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { Tick } from './Types/BuffType';

/**
 * Handles a burn tick.
 */
export class BurnTick implements Tick {
  constructor(
    public mob: Mob,
    public game: GameState,
    public minDmg: number = 2,
    public maxDmg: number = 4,
  ) {}

  /**
   * Executes a tick of the BurnTick class.
   * Deals 2-4 damage every second turn
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  public tick(time: number): void {
    if (time % 2) return;
    const dmg = this.game.rand.randomIntegerClosedRange(
      this.minDmg,
      this.maxDmg,
    );
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
