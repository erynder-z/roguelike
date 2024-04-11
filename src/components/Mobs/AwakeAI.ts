import { MobAI } from './Interfaces/MobAI';
import { GameIF } from '../Builder/Interfaces/Game';
import { Mob } from './Mob';
import { MobAI2_Cat } from './MobAI2_Cat';
import { MobAI3_Ant } from './MobAI3_Ant';
import { Mood } from './MoodEnum';
import { SleepAI } from './SleepAI';

/**
 * An AI implementation for Mobs in an awake state.
 *
 */
export class AwakeAI implements MobAI {
  constructor(public speed: number) {}
  aiTargetedMovement: MobAI = new MobAI2_Cat();
  aiRandomMovement: MobAI = new MobAI3_Ant();

  /**
   * Takes a turn for the Mob in an awake state.
   *
   *
   * @param {Mob} me - The Mob making the turn.
   * @param {Mob} enemy - The enemy Mob.
   * @param {GameIF} game - The game instance.
   * @returns {boolean} - Always `true`.
   */
  turn(me: Mob, enemy: Mob, game: GameIF): boolean {
    const r = game.rand;
    for (let i = 0; i < this.speed; ++i) {
      const ai = r.isOneIn(2) ? this.aiTargetedMovement : this.aiRandomMovement;
      ai.turn(me, enemy, game);
    }
    const far = SleepAI.isNear(me, enemy);
    if (far) me.mood = r.isOneIn(3) ? Mood.Asleep : Mood.Awake;
    return true;
  }
}
