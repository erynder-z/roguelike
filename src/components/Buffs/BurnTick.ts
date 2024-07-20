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
    private readonly MIN_DAMAGE: number = 2,
    private readonly MAX_DAMAGE: number = 4,
  ) {}

  /**
   * Checks if damage should be applied based on the given time.
   *
   * @param {number} timeLeft - The time parameter to check.
   * @return {boolean} True if damage should be applied, false otherwise.
   */
  private shouldApplyDamage(timeLeft: number): boolean {
    return timeLeft % 2 === 0;
  }

  /**
   * Ticks the burn effect on the mob.
   *
   * @param {number} duration - The duration of the burn effect.
   * @param {number} timeLeft - The time left in the burn effect.
   * @return {void} This function does not return a value.
   */
  public tick(duration: number, timeLeft: number): void {
    if (!this.shouldApplyDamage(timeLeft)) return;
    const dmg = this.game.rand.randomIntegerClosedRange(
      this.MIN_DAMAGE,
      this.MAX_DAMAGE,
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
