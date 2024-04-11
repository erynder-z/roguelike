import { MobAI } from './Interfaces/MobAI';
import { GameIF } from '../Builder/Interfaces/Game';
import { Mob } from './Mob';
import { MobAI2_Cat } from './MobAI2_Cat';
import { MobAI3_Ant } from './MobAI3_Ant';
import { Mood } from './MoodEnum';
import { SleepAI } from './SleepAI';
import { GameMap } from '../MapModel/GameMap';
import { CanSee } from '../Utilities/CanSee';
import { Buff } from '../Buffs/BuffEnun';

/**
 * An AI implementation for Mobs in an cast spells.
 *
 */
export class SpellAI implements MobAI {
  constructor(
    public speed: number,
    public spellRate: number,
  ) {}
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
    if (this.maybeCastSpell(me, enemy, game)) return true;
    const r = game.rand;
    for (let i = 0; i < 2; ++i) {
      const ai = r.isOneIn(2) ? this.aiTargetedMovement : this.aiRandomMovement;
      ai.turn(me, enemy, game);
    }
    const far = SleepAI.isNear(me, enemy);
    if (far) me.mood = r.isOneIn(3) ? Mood.Asleep : Mood.Awake;
    return true;
  }

  maybeCastSpell(me: Mob, enemy: Mob, game: GameIF): boolean {
    const map = <GameMap>game.currentMap();
    if (!CanSee.canSee2(me, enemy, map, true)) return false;

    const r = game.rand;
    if (!r.isOneIn(this.spellRate)) return false;
    const buff = this.pickBuff(me, r);

    return this.cast(buff, me, enemy, game);
  }

  pickBuff(me: Mob, r: any): Buff {
    // TODO: Implement buff choosing
    return Buff.Confuse;
  }

  cast(buff: number, me: Mob, enemy: Mob, game: GameIF): boolean {
    const spell = new BuffCommand(buff, enemy, game, me);
    return spell.npcTurn();
  }
}
