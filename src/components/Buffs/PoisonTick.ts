import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { Tick } from './Types/BuffType';

/**
 * Handles a poison tick.
 */
export class PoisonTick implements Tick {
  private readonly poisonDamage: number = 1;

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
   * Checks if damage should be applied based on the remaining time.
   *
   * @param {number} timeLeft - The remaining time for the tick.
   * @return {boolean} True if damage should be applied, false otherwise.
   */
  private shouldApplyDamage(timeLeft: number): boolean {
    return timeLeft % 2 === 0;
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

    if (this.mob.isPlayer) {
      this.game.message(
        new LogMessage(
          `You take ${this.poisonDamage} damage because of the poison!`,
          EventCategory.playerDamage,
        ),
      );
    }

    HealthAdjust.damage(this.mob, this.poisonDamage, this.game, null);
  }
}
