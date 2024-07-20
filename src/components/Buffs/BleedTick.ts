import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { Mob } from '../Mobs/Mob';
import { Tick } from './Types/BuffType';

/**
 * Handles a bleed tick.
 */
export class BleedTick implements Tick {
  private static readonly MIN_DAMAGE: number = 2;
  private static readonly MAX_DAMAGE: number = 5;
  private static readonly RESTING_DAMAGE: number = 1;
  private static readonly RESTING_TURNS_THRESHOLD: number = 2;

  constructor(
    private readonly mob: Mob,
    private readonly game: GameState,
  ) {}

  /**
   * Checks if the current tick is the initial tick.
   *
   * @param {number} duration - The total duration of the tick.
   * @param {number} timeLeft - The remaining time for the tick.
   * @return {boolean} True if it is the initial tick, false otherwise.
   */
  private isInitialTick(duration: number, timeLeft: number): boolean {
    return timeLeft === duration;
  }

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
   * Calculates the damage based on whether the mob is resting or not.
   *
   * @return {number} The calculated damage value.
   */
  private calculateDamage(): number {
    const isResting = this.mob.sinceMove > BleedTick.RESTING_TURNS_THRESHOLD;
    return isResting
      ? BleedTick.RESTING_DAMAGE
      : this.game.rand.randomIntegerClosedRange(
          BleedTick.MIN_DAMAGE,
          BleedTick.MAX_DAMAGE,
        );
  }

  /**
   * Performs a tick action based on the duration and time left.
   *
   * @param {number} duration - The duration of the tick action.
   * @param {number} timeLeft - The remaining time for the tick action.
   */
  public tick(duration: number, timeLeft: number): void {
    if (
      this.isInitialTick(duration, timeLeft) ||
      !this.shouldApplyDamage(timeLeft)
    ) {
      return;
    }

    const damage = this.calculateDamage();

    if (this.mob.isPlayer) {
      this.game.message(
        new LogMessage(
          `You take ${damage} damage because of the bleeding!`,
          EventCategory.playerDamage,
        ),
      );
    }

    HealthAdjust.damage(this.mob, damage, this.game, null);
  }
}
