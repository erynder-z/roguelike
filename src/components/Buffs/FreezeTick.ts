import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { Tick } from './Types/BuffType';

/**
 * Handles a freeze tick.
 */
export class FreezeTick implements Tick {
  constructor(
    public mob: Mob,
    public game: GameState,
    private readonly MIN_DAMAGE: number = 0,
    private readonly MAX_DAMAGE: number = 2,
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
   * Ticks the freeze effect on the mob.
   *
   * @param {number} duration - The duration of the freeze effect.
   * @param {number} timeLeft - The time left in the freeze effect.
   * @return {void} This function does not return a value.
   */
  public tick(duration: number, timeLeft: number): void {
    if (!this.shouldApplyDamage(timeLeft)) return;
    if (this.mob.sinceMove < 2) return;
    const dmg = this.game.rand.randomIntegerClosedRange(
      this.MIN_DAMAGE,
      this.MAX_DAMAGE,
    );
    if (this.mob.isPlayer) {
      const msg = new LogMessage(
        `You take ${dmg} damage because you are freezing!`,
        EventCategory.playerDamage,
      );
      this.game.message(msg);
    }

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
