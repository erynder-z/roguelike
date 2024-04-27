import { MobAI } from './Interfaces/MobAI';
import { GameIF } from '../Builder/Interfaces/Game';
import { AwakeAI } from './AwakeAI';
import { Mob } from './Mob';
import { Mood } from './MoodEnum';
import { SimpleSleepAI } from './SimpleSleepAI';
import { SpellAI } from './SpellAI';
import { VisibilityAwareSleepAI } from './VisibilityAwareSleepAI';

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
   * Creates a default MoodAI instance with a SimpleSleepAI for asleep and AwakeAI for awake.
   *
   *
   * @returns {MoodAI} - A new MoodAI instance with default AIs.
   */
  static stockMood(speed: number): MobAI {
    return new MoodAI(new VisibilityAwareSleepAI(), new AwakeAI(speed));
  }

  static stockMoodSpellCaster(speed: number, spellRate: number): MobAI {
    return new MoodAI(new SimpleSleepAI(), new SpellAI(speed, spellRate));
  }
}
