import { AwakeAI } from './awakeAI';
import { GameState } from '../../gameBuilder/types/gameState';
import { Mob } from './mob';
import { MobAI } from './types/mobAI';
import { Mood } from './moodEnum';
import { ScreenMaker } from '../screens/types/ScreenMaker';
import { ShootAI } from './shootAI';
import { SimpleSleepAI } from './simpleSleepAI';
import { SpellAI } from './spellAI';
import { Stack } from '../../terminal/types/stack';
import { VisibilityAwareSleepAI } from './visibilityAwareSleepAI';

/**
 * An AI implementation that delegates behavior based on a Mob's mood.
 *
 */
export class MoodAI implements MobAI {
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
   * @param {GameState} game - The game instance.
   * @param {Stack} stack - The screen stack.
   * @param {ScreenMaker} make - The screen maker.
   * @returns {boolean} - The result of the delegated turn action.
   */
  public turn(
    me: Mob,
    enemy: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean {
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
    return ai!.turn(me, enemy, game, stack, make);
  }

  /**
   * Creates a default MoodAI instance with a SimpleSleepAI for asleep and AwakeAI for awake.
   *
   *
   * @returns {MoodAI} - A new MoodAI instance with default AIs.
   */
  public static stockMood(speed: number): MobAI {
    return new MoodAI(new VisibilityAwareSleepAI(), new AwakeAI(speed));
  }

  public static stockMoodSpellCaster(speed: number, spellRate: number): MobAI {
    return new MoodAI(new SimpleSleepAI(), new SpellAI(speed, spellRate));
  }

  public static stockMoodShootAI(speed: number, spellRate: number): MobAI {
    return new MoodAI(new SimpleSleepAI(), new ShootAI(speed, spellRate));
  }
}
