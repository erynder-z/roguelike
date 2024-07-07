import { GameState } from '../Builder/Types/GameState';
import { Mob } from './Mob';
import { MobAI } from './Types/MobAI';
import { MobAI2_Cat } from './MobAI2_Cat';
import { MobAI3_Ant } from './MobAI3_Ant';
import { Mood } from './MoodEnum';
import { ScreenMaker } from '../Screens/Types/ScreenMaker';
import { SimpleSleepAI } from './SimpleSleepAI';
import { Stack } from '../Terminal/Types/Stack';

/**
 * An AI implementation for Mobs in an awake state.
 *
 */
export class AwakeAI implements MobAI {
  constructor(public speed: number) {}
  private aiTargetedMovement: MobAI = new MobAI2_Cat();
  private aiRandomMovement: MobAI = new MobAI3_Ant();

  /**
   * Takes a turn for the Mob in an awake state.
   *
   *
   * @param {Mob} me - The Mob making the turn.
   * @param {Mob} enemy - The enemy Mob.
   * @param {Game} game - The game instance.
   * @param {Stack} game - The screen stack.
   * @param {ScreenMaker} make - The screen maker.
   * @returns {boolean} - Always `true`.
   */
  public turn(
    me: Mob,
    enemy: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean {
    const r = game.rand;
    for (let i = 0; i < this.speed; ++i) {
      const ai = r.isOneIn(2) ? this.aiTargetedMovement : this.aiRandomMovement;
      ai.turn(me, enemy, game, stack, make);
    }
    const far = !SimpleSleepAI.isNear(me, enemy);
    if (far) me.mood = r.isOneIn(3) ? Mood.Asleep : Mood.Awake;
    return true;
  }
}
