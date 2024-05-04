import { MobAI } from './Interfaces/MobAI';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { Glyph } from '../Glyphs/Glyph';
import { Mob } from './Mob';
import { MobAI2_Cat } from './MobAI2_Cat';
import { MobAI3_Ant } from './MobAI3_Ant';
import { MoodAI } from './MoodAI';
import { MobAI5_Druid } from './MobAI5_Druid';

/**
 * Represents an AI switcher that selects the appropriate AI implementation based on the type of mob.
 */
export class AISwitcher implements MobAI {
  constructor(public ai1_std: MobAI) {}
  ai2_cat: MobAI = new MobAI2_Cat();
  ai3_ant: MobAI = new MobAI3_Ant();
  ai4_bat: MobAI = MoodAI.stockMood(2);
  ai5_druid: MobAI = new MobAI5_Druid(1, 5);
  ai_spell: MobAI = MoodAI.stockMoodSpellCaster(1, 8);
  ai_default: MobAI = MoodAI.stockMood(1);

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
        ai = this.ai3_ant;
        break;
      case Glyph.Bat:
        ai = this.ai4_bat;
        break;
      case Glyph.Cat:
        ai = this.ai2_cat;
        break;
      case Glyph.Druid:
        ai = this.ai5_druid;
        break;
      default:
        ai = this.ai1_std;
        break;
    }
    return ai.turn(me, enemy, game);
  }
}
