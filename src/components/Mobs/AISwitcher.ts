import { MobAI } from '../../interfaces/AI/MobAI';
import { GameIF } from '../../interfaces/Builder/Game';
import { Glyph } from '../MapModel/Glyph';
import { Mob } from './Mob';
import { MobAI2_Cat } from './MobAI2_Cat';
import { MobAI3_Ant } from './MobAI3_Ant';
import { MoodAI } from './MoodAI';

/**
 * Represents an AI switcher that selects the appropriate AI implementation based on the type of mob.
 */
export class AISwitcher implements MobAI {
  ai2_cat: MobAI = new MobAI2_Cat();
  ai3_ant: MobAI = new MobAI3_Ant();
  ai4_bat: MobAI = MoodAI.stockMood(2);

  /**
   * Executes a turn for the mob using the appropriate AI based on the mob's type.
   * @param {Mob} me - The current mob controlled by this AI.
   * @param {Mob} enemy - The enemy mob.
   * @param {GameIF} game - The game interface.
   * @returns {boolean} - True if the turn was successfully executed, false otherwise.
   */
  turn(me: Mob, enemy: Mob, game: GameIF): boolean {
    let ai: MobAI;
    switch (me.glyph) {
      default:
      case Glyph.Cat:
        ai = this.ai2_cat;
        break;
      case Glyph.Ant:
        ai = this.ai3_ant;
        break;
      case Glyph.Bat:
        ai = this.ai4_bat;
        break;
    }
    return ai.turn(me, enemy, game);
  }
}
