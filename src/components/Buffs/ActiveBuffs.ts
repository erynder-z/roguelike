import { GameIF } from '../Builder/Interfaces/GameIF';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { GrammarHandler } from '../Utilities/GrammarHandler';
import { Buff } from './BuffEnum';
import { BuffIF } from './Interfaces/BuffIF';

/**
 * Represents a collection of active buffs applied to a mob in the game.
 */
export class ActiveBuffs {
  _map: Map<Buff, BuffIF> = new Map();

  /**
   * Adds a buff to the collection of active buffs for a given mob.
   * @param {BuffIF} b - The buff to add.
   * @param {GameIF} game - The game interface.
   * @param {Mob} mob - The mob to apply the buff to.
   */
  add(b: BuffIF, game: GameIF, mob: Mob): void {
    this._map.set(b.buff, b);
    const buffAdj = GrammarHandler.BuffToAdjective(b.buff) || b.buff;
    const msg = new LogMessage(
      `${mob.name} is ${buffAdj}!`,
      EventCategory.buff,
    );

    game.message(msg);
  }

  /**
   * Deletes a buff from the collection of active buffs for a given mob.
   * @param {BuffIF} b - The buff to delete.
   * @param {GameIF} game - The game interface.
   * @param {Mob} mob - The mob to remove the buff from.
   */
  delete(b: BuffIF, game: GameIF, mob: Mob): void {
    this._map.delete(b.buff);
    const buffAdj = GrammarHandler.BuffToAdjective(b.buff) || b.buff;
    const msg = new LogMessage(
      `You are no longer ${buffAdj}!`,
      EventCategory.buff,
    );
    if (mob.isPlayer) game.message(msg);
  }

  /**
   * Checks if a specific type of buff is currently active on the mob.
   * @param {Buff} buff - The buff to check.
   * @returns {boolean} - True if the buff is active, false otherwise.
   */
  is(buff: Buff): boolean {
    return this._map.has(buff);
  }

  /**
   * Gets the information of the buff of a specific type currently active on the mob.
   * @param {Buff} buff - The buff to get information for.
   * @returns {BuffIF | undefined} - The information of the buff if active, otherwise undefined.
   */
  get(buff: Buff): BuffIF | undefined {
    return this._map.get(buff);
  }

  /**
   * Cleanses a specific type of buff from the mob, removing it from the active buffs collection.
   * @param {Buff} buff - The buff to cleanse.
   * @param {GameIF} game - The game interface.
   * @param {Mob} mob - The mob to cleanse the buff from.
   */
  cleanse(buff: Buff, game: GameIF, mob: Mob): void {
    const b = mob.buffs.get(buff);
    if (b) this.delete(b, game, mob);
  }

  /**
   * Progresses the active buffs by decrementing their timers and removing expired buffs.
   * @param {Mob} mob - The mob to process active buffs for.
   * @param {GameIF} game - The game interface.
   */
  ticks(mob: Mob, game: GameIF): void {
    for (const b of this._map.values()) {
      --b.time;
      if (b.effect) b.effect.tick(b.time);
      if (b.time <= 0) this.delete(b, game, mob);
    }
  }
}
