import { GameIF } from '../Builder/Interfaces/Game';
import { Command } from './Interfaces/Command';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { Act } from './Act';
import { Able } from './Able';
import { Buff } from '../Buffs/BuffEnum';

/**
 * Abstract class representing a base command implementation that implements the Command interface.
 */
export abstract class CommandBase implements Command {
  act: Act = Act.Act;
  /**
   * Constructs a new CommandBase object.
   * @param {Mob} me - The mob performing the command.
   * @param {GameIF} g - The game interface.
   */
  constructor(
    public me: Mob,
    public g: GameIF,
  ) {}

  /**
   * Executes the command.
   * @returns {boolean} Always throws an error, should be implemented in subclasses.
   */
  execute(): boolean {
    throw 'no exc';
  }

  /**
   * Sets the direction of the command.
   * @param {WorldPoint} direction - The direction to set.
   * @returns {Command} The command object.
   */
  setDirection(direction: WorldPoint): Command {
    throw 'no setDirection';
  }

  /**
   * Executes a turn for the mob if it is able to do so.
   * @returns {boolean} The result of executing the command.
   */
  public turn(): boolean {
    const r = this.able(<Mob>this.me, <GameIF>this.g, this.act);

    if (!r.isAble) return r.usesTurn;
    return this.execute();
  }

  /**
   * Determines if a mob is able to perform a certain action.
   *
   * @param {Mob} m - The mob performing the action.
   * @param {GameIF} g - The game interface.
   * @param {Act} act - The action being performed.
   * @returns {Able} An object indicating if the mob is able to perform the action and if it uses a turn.
   */
  able(m: Mob, g: GameIF, act: Act): Able {
    const cant = { isAble: false, usesTurn: false };
    const negate = { isAble: false, usesTurn: true };
    const able = { isAble: true, usesTurn: true };

    const hit = act == Act.Hit;
    const move = act == Act.Move;
    const hitOrMove = hit || move;

    if (hit && this.afraid(m, g)) return cant;
    if (hit && this.charmed(m, g)) return cant;
    if (move && this.rooted(m, g)) return cant;
    if (hitOrMove && this.levitate(m, g)) return cant;

    if (this.paralyzed(m, g)) return negate;
    if (this.asleep(m, g)) return negate;
    if (this.slow(m, g)) return negate;
    if (this.freeze(m, g, move)) return negate;

    return able;
  }

  /**
   * Checks if the given mob is afraid and flashes a message if it is the player.
   *
   * @param {Mob} me - The mob to check for fear.
   * @param {GameIF} g - The game interface for flashing messages.
   * @return {boolean} - Whether the mob is afraid or not.
   */
  afraid(me: Mob, g: GameIF): boolean {
    const afraid = me.is(Buff.Afraid);
    if (afraid && me.isPlayer) g.flash('You are afraid!');
    return afraid;
  }

  /**
   * Checks if the given mob is charmed and if it is a player. If it is, flashes a message to the game interface.
   *
   * @param {Mob} me - The mob to check for charm.
   * @param {GameIF} g - The game interface to flash the message to.
   * @return {boolean} True if the mob is charmed, false otherwise.
   */
  charmed(me: Mob, g: GameIF): boolean {
    const charmed = me.is(Buff.Charm);
    if (charmed && me.isPlayer) g.flash("It's too cute!");
    return charmed;
  }

  /**
   * Checks if the given mob is rooted and if it is a player, flashes a message to the game interface.
   *
   * @param {Mob} me - The mob to check for root.
   * @param {GameIF} g - The game interface to flash the message to.
   * @return {boolean} True if the mob is rooted, false otherwise.
   */
  rooted(me: Mob, g: GameIF): boolean {
    const rooted = me.is(Buff.Root);
    if (rooted && me.isPlayer) g.flash("You can't move!");
    return rooted;
  }

  /**
   * Checks if the given mob is levitating and flashes a message if it is the player.
   *
   * @param {Mob} me - The mob to check for levitation.
   * @param {GameIF} g - The game interface for flashing messages.
   * @return {boolean} - Whether the mob is levitating or not.
   */
  levitate(me: Mob, g: GameIF): boolean {
    const levitate = me.is(Buff.Levitate);
    if (levitate && me.isPlayer) g.flash('You are hovering!');
    return levitate;
  }

  /**
   * Checks if the given mob is paralyzed and flashes a message if it is the player.
   *
   * @param {Mob} me - The mob to check for paralysis.
   * @param {GameIF} g - The game interface for flashing messages.
   * @returns {boolean} - Whether the mob is paralyzed or not.
   */
  paralyzed(me: Mob, g: GameIF): boolean {
    if (!me.is(Buff.Paralyze)) return false;
    let rate = 0;
    switch (this.act) {
      case Act.Move:
        rate = 33;
        break;
      case Act.Hit:
        rate = 25;
        break;
      case Act.Act:
        rate = 20;
        break;
    }

    const paralyzed = !g.rand.determineSuccess(rate);

    if (paralyzed) {
      if (me.isPlayer) g.flash('You are paralyzed!');
    } else {
      const buff = me.buffs.get(Buff.Paralyze);
      buff!.time -= g.rand.randomIntegerClosedRange(1, 2);
    }
    return paralyzed;
  }

  /**
   * Checks if the given mob is asleep and flashes a message if it is the player.
   *
   * @param {Mob} me - The mob to check for sleep.
   * @param {GameIF} g - The game interface to flash the message to.
   * @return {boolean} - Whether the mob is asleep or not.
   */
  asleep(me: Mob, g: GameIF): boolean {
    if (!me.is(Buff.Sleep)) return false;
    if (me.isPlayer) g.flash('You are asleep!');
    return true;
  }

  /**
   * Checks if the given mob is slowed and flashes a message if it is the player.
   *
   * @param {Mob} me - The mob to check for being slowed.
   * @param {GameIF} g - The game interface for checking conditions and displaying messages.
   * @returns {boolean} - True if the mob is slowed, false otherwise.
   */
  slow(me: Mob, g: GameIF): boolean {
    if (!me.is(Buff.Slow)) return false;
    if (g.rand.isOneIn(2)) return false;
    if (me.isPlayer) g.flash('You are slowed!');
    return true;
  }

  /**
   * Checks if the given mob is frozen and flashes a message if it is the player.
   *
   * @param {Mob} me - The mob to check for freezing.
   * @param {GameIF} g - The game interface for flashing messages.
   * @param {boolean} move - Indicates if the mob is trying to move.
   * @returns {boolean} - Whether the mob is frozen or not.
   */
  freeze(me: Mob, g: GameIF, move: boolean): boolean {
    if (!me.is(Buff.Freeze)) return false;
    if (move && g.rand.isOneIn(2)) return false;
    if (me.isPlayer) g.flash('You are frozen!');
    return true;
  }

  /**
   * Checks if the mob is confused and updates the direction accordingly.
   *
   * @param {GameIF} g - The game interface for handling randomness.
   * @param {WorldPoint} dir - The direction to update.
   * @returns {boolean} Whether the mob is confused or not.
   */
  confused(g: GameIF, dir: WorldPoint): boolean {
    if (!this.me.is(Buff.Confuse)) return false;
    const r = g.rand;
    if (r.isOneIn(2)) return false;
    if (this.me.isPlayer) g.flash('You are confused!');

    const cd = r.randomDirectionForcedMovement();
    dir.x = cd.x;
    dir.y = cd.y;
    return true;
  }

  /**
   * Executes the command directly.
   * @returns {boolean} The result of executing the command.
   */
  public raw(): boolean {
    return this.execute();
  }

  /**
   * Executes a non-player character (NPC) turn.
   * @returns {boolean} The result of executing the command.
   */
  public npcTurn(): boolean {
    return this.turn();
  }
}
