import { Buff } from './BuffEnum';
import { BuffType } from './Types/BuffType';
import { GameState } from '../Builder/Types/GameState';
import { GrammarHandler } from '../Utilities/GrammarHandler';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';

/**
 * Handles managing buffs on a mob.
 */
export class ActiveBuffs {
  _map: Map<Buff, BuffType> = new Map();

  /**
   * Adds a buff to the collection of active buffs for a given mob.
   * @param {BuffType} b - The buff to add.
   * @param {Game} game - The game object.
   * @param {Mob} mob - The mob to apply the buff to.
   */
  public add(b: BuffType, game: GameState, mob: Mob): void {
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
   * @param {BuffType} b - The buff to delete.
   * @param {Game} game - The game object.
   * @param {Mob} mob - The mob to remove the buff from.
   */
  public delete(b: BuffType, game: GameState, mob: Mob): void {
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
  public is(buff: Buff): boolean {
    return this._map.has(buff);
  }

  /**
   * Gets the information of the buff of a specific type currently active on the mob.
   * @param {Buff} buff - The buff to get information for.
   * @returns {BuffType | undefined} - The information of the buff if active, otherwise undefined.
   */
  public get(buff: Buff): BuffType | undefined {
    return this._map.get(buff);
  }

  /**
   * Cleanses a specific type of buff from the mob, removing it from the active buffs collection.
   * @param {Buff} buff - The buff to cleanse.
   * @param {Game} game - The game object.
   * @param {Mob} mob - The mob to cleanse the buff from.
   */
  public cleanse(buff: Buff, game: GameState, mob: Mob): void {
    const b = mob.buffs.get(buff);
    if (b) this.delete(b, game, mob);
  }

  /**
   * Progresses the active buffs by decrementing their timers and removing expired buffs.
   * @param {Mob} mob - The mob to process active buffs for.
   * @param {Game} game - The game object.
   */
  public ticks(mob: Mob, game: GameState): void {
    for (const b of this._map.values()) {
      --b.time;
      if (b.effect) b.effect.tick(b.time);
      if (b.time <= 0) this.delete(b, game, mob);
    }
  }
}
