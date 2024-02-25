import { MobAI } from '../../interfaces/AI/MobAI';
import { GameIF } from '../../interfaces/Builder/Game';
import { Glyph } from '../MapModel/Glyph';
import { Mob } from './Mob';
import { MobAI2_Cat } from './MobAI2_Cat';
import { MobAI3_Ant } from './MobAI3_Ant';

/**
 * Represents an AI switcher that selects the appropriate AI implementation based on the type of mob.
 */
export class AISwitcher implements MobAI {
  ai2: MobAI = new MobAI2_Cat();
  ai3: MobAI = new MobAI3_Ant();

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
      case Glyph.Ant:
        ai = this.ai3;
        break;
      case Glyph.Cat:
        ai = this.ai2;
        break;
      default:
        ai = this.ai2;
        break;
    }
    return ai.turn(me, enemy, game);
  }
}
