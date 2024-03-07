import { MobAI } from '../../interfaces/AI/MobAI';
import { GameIF } from '../../interfaces/Builder/Game';
import { AwakeAI } from './AwakeAI';
import { Mob } from './Mob';
import { Mood } from './MoodEnum';
import { SleepAI } from './SleepAI';

/**
 * An AI implementation that delegates behavior based on a Mob's mood.
 *
 */
export class MoodAI implements MobAI {
  /**
   * Creates a new MoodAI instance.
   *
   * @param {MobAI} asleep - The AI to use when the Mob is asleep.
   * @param {MobAI} awake - The AI to use when the Mob is awake.
   */
  constructor(
    public asleep: MobAI,
    public awake: MobAI,
  ) {}

  /**
   * Delegates the turn action to the appropriate AI based on the Mob's mood.
   *
   *
   * @param {Mob} me - The Mob making the turn.
   * @param {Mob} enemy - The enemy Mob.
   * @param {GameIF} game - The game instance.
   * @returns {boolean} - The result of the delegated turn action.
   */
  turn(me: Mob, enemy: Mob, game: GameIF): boolean {
    let ai: MobAI;
    switch (me.mood) {
      case Mood.Asleep:
        ai = this.asleep;
        break;
      case Mood.Awake:
        ai = this.awake;
        break;
      default:
        ai = this.asleep;
        break;
    }
    return ai!.turn(me, enemy, game);
  }

  /**
   * Creates a default MoodAI instance with a SleepAI for asleep and AwakeAI for awake.
   *
   *
   * @returns {MoodAI} - A new MoodAI instance with default AIs.
   */
  static stockMood(): MobAI {
    return new MoodAI(new SleepAI(), new AwakeAI());
  }
}
