import { Buff } from '../Buffs/BuffEnum';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { HealthAdjust } from './HealthAdjust';

/**
 * Manages auto healing for a mob.
 */
export class AutoHeal {
  constructor(
    public amountToHealMin: number = 1,
    public timeToHealMax: number = 5,
    public nextWait: number = 0,
    public amount: number = 0,
    public countdown: number = 0,
  ) {
    this.resetHeal();
  }

  /**
   * Resets auto healing during combat for a mob.
   * @param mob - The mob to reset healing for.
   * @param game - The game interface.
   */
  public static combatReset(mob: Mob, game: GameIF) {
    this.clearSleep(mob, game);
    const ah = game.autoHeal;

    if (mob.isPlayer && ah) ah.resetHeal();
  }

  /**
   * Clears the sleep buff from a mob if it exists and the mob is a player,
   * and displays a message indicating that the player has woken up.
   *
   * @param {Mob} mob - The mob to clear the sleep buff from.
   * @param {GameIF} game - The game interface to display the message on.
   */
  static clearSleep(mob: Mob, game: GameIF) {
    if (!mob.is(Buff.Sleep)) return;
    mob.buffs.cleanse(Buff.Sleep, game, mob);

    const msg = new LogMessage("You've woken up!", EventCategory.buff);
    if (mob.isPlayer) game.message(msg);
  }

  /**
   * Resets auto healing during combat for multiple mobs.
   * @param a - The first mob.
   * @param b - The second mob, if exists.
   * @param game - The game interface.
   */
  public static combatResets(a: Mob, b: Mob | null, game: GameIF) {
    this.combatReset(a, game);

    if (b) AutoHeal.combatReset(b, game);
  }
  /**
   * Reset the healing parameters to their initial values.
   */
  private resetHeal() {
    this.nextWait = this.timeToHealMax;
    this.amount = this.amountToHealMin;
    this.countdown = this.nextWait;
  }

  /**
   * Processes a turn for auto healing.
   * @param player - The player mob.
   * @param game - The game interface.
   */
  public turn(player: Mob, game: GameIF) {
    if (this.isAtFullHealth(player)) return;
    this.step_timeToHeal(player, game);
  }

  /**
   * Checks if the mob is at full health.
   * @param mob - The mob to check.
   * @return {boolean} if at full health
   */
  private isAtFullHealth(mob: Mob): boolean {
    return mob.hp >= mob.maxhp;
  }

  /**
   * Steps the countdown for healing.
   * @param player - The player mob.
   * @param game - The game interface.
   */
  private step_timeToHeal(player: Mob, game: GameIF) {
    this.countdown > 0 ? --this.countdown : this.healTick(player, game);
  }

  /**
   * Executes healing for the player mob.
   * @param player - The player mob.
   * @param game - The game interface.
   */
  private healTick(player: Mob, game: GameIF) {
    const msg = new LogMessage(
      `auto-healing ${this.amount} hp`,
      EventCategory.heal,
    );
    game.message(msg);

    HealthAdjust.heal(player, this.amount);
    ++this.amount;
    if (this.nextWait > 1) --this.nextWait;

    this.countdown = this.nextWait;
  }
}
