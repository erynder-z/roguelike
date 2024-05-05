import { MobAI } from './Interfaces/MobAI';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { Mob } from './Mob';
import { MobAI2_Cat } from './MobAI2_Cat';
import { MobAI3_Ant } from './MobAI3_Ant';
import { Mood } from './MoodEnum';
import { SimpleSleepAI } from './SimpleSleepAI';
import { GameMap } from '../MapModel/GameMap';
import { CanSee } from '../Utilities/CanSee';
import { Buff } from '../Buffs/BuffEnum';
import { BuffCommand } from '../Commands/BuffCommand';

/**
 * Represents an implementation of MobAI for a druid-type mob.
 * A test spellcaster
 */
export class MobAI5_Druid implements MobAI {
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
    const far = SimpleSleepAI.isNear(me, enemy);
    if (far) me.mood = r.isOneIn(3) ? Mood.Asleep : Mood.Awake;
    return true;
  }

  /**
   * A function to potentially cast a spell between two mobs in the game.
   *
   * @param {Mob} me - the casting mob
   * @param {Mob} enemy - the target mob
   * @param {GameIF} game - the game interface
   * @return {boolean} true if the spell was cast, false otherwise
   */
  maybeCastSpell(me: Mob, enemy: Mob, game: GameIF): boolean {
    const map = <GameMap>game.currentMap();
    if (!CanSee.canSee2(me, enemy, map, true)) return false;

    const r = game.rand;
    if (!r.isOneIn(this.spellRate)) return false;
    const buff = this.pickBuff(me, r);

    return this.cast(buff, me, enemy, game);
  }

  /**
   * A function that picks a buff for a given mob.
   *
   * @param {Mob} me - the mob for which to pick the buff
   * @param {any} r - a parameter whose role is unclear
   * @return {Buff} the chosen buff for the mob
   */
  pickBuff(me: Mob, r: any): Buff {
    // TODO: Implement buff choosing
    return Buff.Bleed;
  }

  /**
   * Casts a spell on the enemy mob using the given buff, current mob, enemy mob, and game interface.
   *
   * @param {number} buff - the buff to cast
   * @param {Mob} me - the current mob
   * @param {Mob} enemy - the enemy mob
   * @param {GameIF} game - the game interface
   * @return {boolean} the result of the spell cast
   */
  cast(buff: number, me: Mob, enemy: Mob, game: GameIF): boolean {
    const spell = new BuffCommand(buff, enemy, game, me);
    return spell.npcTurn();
  }
}
