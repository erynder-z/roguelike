import { GameState } from '../Builder/Types/GameState';
import { Mob } from './Mob';
import { MobAI } from './Types/MobAI';
import { Mood } from './MoodEnum';

/**
 * An AI implementation for Mobs in a sleep state.
 */
export class SimpleSleepAI implements MobAI {
  /**
   * Takes a turn for the Mob in a sleep state.
   *
   *
   * @param {Mob} me - The Mob making the turn.
   * @param {Mob} enemy - The enemy Mob.
   * @param {GameState} game - The game instance.
   * @returns {boolean} - Always `true`.
   */
  public turn(me: Mob, enemy: Mob, game: GameState): boolean {
    if (SimpleSleepAI.isNear(me, enemy)) {
      me.mood = game.rand.isOneIn(3) ? Mood.Awake : Mood.Asleep;
    }
    return true;
  }

  /**
   * Checks if an enemy Mob is within a certain distance of the given Mob.
   *
   *
   * @param {Mob} me - The Mob to check from.
   * @param {Mob} enemy - The enemy Mob to check the distance to.
   * @returns {boolean} - `true` if the enemy is near, `false` otherwise.
   */
  public static isNear(me: Mob, enemy: Mob): boolean {
    const distance = me.pos.distanceTo(enemy.pos);
    return distance < 6;
  }
}
