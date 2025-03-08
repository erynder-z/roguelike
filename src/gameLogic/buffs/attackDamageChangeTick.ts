import { GameState } from '../../types/gameBuilder/gameState';
import { Mob } from '../mobs/mob';
import { Tick } from '../../types/gameLogic/buffs/buffType';

/**
 * Handles a tick during the attackUp buff.
 */
export class AttackDamageChangeTick implements Tick {
  constructor(
    private readonly mob: Mob,
    private readonly game: GameState,
    private amount: number,
  ) {}

  /**
   * Checks if the current tick is the final tick.
   *
   * @param {number} timeLeft - The time left in the modifier.
   * @return {boolean} True if it is the final tick, false otherwise.
   */
  private isFinalTick(timeLeft: number): boolean {
    return timeLeft === 0;
  }

  /**
   * Applies the attack damage modifier to the game state.
   *
   * @param {number} duration - The duration of the attack damage modifier.
   * @param {number} timeLeft - The time left in the modifier.
   * @return {void} This function does not return a value.
   */
  public tick(duration: number, timeLeft: number): void {
    if (!this.isFinalTick(timeLeft)) return;

    this.game.stats.adjustDamageDealModifier(-this.amount);
  }
}
