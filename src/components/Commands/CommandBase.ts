import { GameIF } from '../Builder/Interfaces/GameIF';
import { Command } from './Interfaces/Command';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { Act } from './Act';
import { Able } from './Interfaces/Able';
import { Buff } from '../Buffs/BuffEnum';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Cost } from './Interfaces/Cost';

/**
 * Abstract class representing a base command implementation that implements the Command interface.
 */
export abstract class CommandBase implements Command {
  constructor(
    public me: Mob,
    public g: GameIF,
    public act: Act = Act.Act,
    public cost?: Cost,
    public target?: Mob,
  ) {}

  public setCost(cost?: Cost) {
    this.cost = cost;
  }

  /**
   * Executes the command.
   * @returns {boolean} Always throws an error, should be implemented in subclasses.
   */
  public execute(): boolean {
    throw 'no exc';
  }

  /**
   * Sets the direction of the command.
   * @param {WorldPoint} direction - The direction to set.
   * @returns {Command} The command object.
   */
  public setDirection(direction: WorldPoint): Command {
    throw 'no setDirection';
  }

  /**
   * Sets the target of the function to the specified Mob.
   *
   * @param {Mob | undefined} target - The Mob object to set as the target.
   * @return {void} This function does not return anything.
   */
  public setTarget(target: Mob): void {
    this.target = target;
  }

  /**
   * Returns true, if an items has no associated cost. If it has a cost, calls pay on that item.
   *
   * @return {boolean} True if the cost can be paid, false otherwise.
   */
  private pay(): boolean {
    if (!this.cost) return true;
    return this.cost.pay();
  }

  /**
   * Executes a turn for the mob if it is able to do so.
   * @returns {boolean} The result of executing the command.
   */
  public turn(): boolean {
    const r = this.able(<Mob>this.me, <GameIF>this.g, this.act);

    if (!r.isAble) return r.usesTurn;
    if (!this.pay()) return true;
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
  public able(m: Mob, g: GameIF, act: Act): Able {
    const cant = { isAble: false, usesTurn: false };
    const negate = { isAble: false, usesTurn: true };
    const able = { isAble: true, usesTurn: false };

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
   *  If afraid, the player can not attack.
   *
   * @param {Mob} me - The mob to check for fear.
   * @param {GameIF} g - The game interface for flashing messages.
   * @return {boolean} - Whether the mob is afraid or not.
   */
  private afraid(me: Mob, g: GameIF): boolean {
    const afraid = me.is(Buff.Afraid);
    const msg = new LogMessage('You are too afraid!', EventCategory.buff);
    if (afraid && me.isPlayer) g.flash(msg);
    return afraid;
  }

  /**
   * Checks if the given mob is charmed and if it is a player. If it is, flashes a message to the game interface.
   * If charmed, the player can not attack. Charmed status is cleared if the charming spellcaster attacks the player.
   *
   * @param {Mob} me - The mob to check for charm.
   * @param {GameIF} g - The game interface to flash the message to.
   * @return {boolean} True if the mob is charmed, false otherwise.
   */
  private charmed(me: Mob, g: GameIF): boolean {
    const charmed = me.is(Buff.Charm);
    const msg = new LogMessage("It's too cute!", EventCategory.buff);
    if (charmed && me.isPlayer) g.flash(msg);
    return charmed;
  }

  /**
   * Checks if the given mob is rooted and if it is a player, flashes a message to the game interface.
   * If rooted, the player can not move.
   *
   * @param {Mob} me - The mob to check for root.
   * @param {GameIF} g - The game interface to flash the message to.
   * @return {boolean} True if the mob is rooted, false otherwise.
   */
  private rooted(me: Mob, g: GameIF): boolean {
    const rooted = me.is(Buff.Root);
    const msg = new LogMessage("You can't move!", EventCategory.buff);
    if (rooted && me.isPlayer) g.flash(msg);
    return rooted;
  }

  /**
   * Checks if the given mob is levitating and flashes a message if it is the player.
   * If levitating, the player can not move or attack with melee weapons.
   *
   * @param {Mob} me - The mob to check for levitation.
   * @param {GameIF} g - The game interface for flashing messages.
   * @return {boolean} - Whether the mob is levitating or not.
   */
  private levitate(me: Mob, g: GameIF): boolean {
    const levitate = me.is(Buff.Levitate);
    const msg = new LogMessage('You are hovering!', EventCategory.buff);
    if (levitate && me.isPlayer) g.flash(msg);
    return levitate;
  }

  /**
   * Checks if the given mob is paralyzed and flashes a message if it is the player.
   * If paralyzed, the player's actions have to pass a dice roll check in order to perform them.
   *
   * @param {Mob} me - The mob to check for paralysis.
   * @param {GameIF} g - The game interface for flashing messages.
   * @returns {boolean} - Whether the mob is paralyzed or not.
   */
  private paralyzed(me: Mob, g: GameIF): boolean {
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
      const msg = new LogMessage('You are paralyzed!', EventCategory.buff);
      if (me.isPlayer) g.flash(msg);
    } else {
      const buff = me.buffs.get(Buff.Paralyze);
      buff!.time -= g.rand.randomIntegerClosedRange(1, 2);
    }
    return paralyzed;
  }

  /**
   * Checks if the given mob is asleep and flashes a message if it is the player.
   * If asleep, the player can not move or attack. Sleep status is cleared when receiving damage.
   *
   * @param {Mob} me - The mob to check for sleep.
   * @param {GameIF} g - The game interface to flash the message to.
   * @return {boolean} - Whether the mob is asleep or not.
   */
  private asleep(me: Mob, g: GameIF): boolean {
    if (!me.is(Buff.Sleep)) return false;
    const msg = new LogMessage('You are asleep!', EventCategory.buff);
    if (me.isPlayer) g.flash(msg);
    return true;
  }

  /**
   * Checks if the given mob is slowed and flashes a message if it is the player.
   * If slowed, half of the player's actions have a 50% chance to fail.
   *
   * @param {Mob} me - The mob to check for being slowed.
   * @param {GameIF} g - The game interface for checking conditions and displaying messages.
   * @returns {boolean} - True if the mob is slowed, false otherwise.
   */
  private slow(me: Mob, g: GameIF): boolean {
    if (!me.is(Buff.Slow)) return false;
    if (g.rand.isOneIn(2)) return false;
    const msg = new LogMessage('You are slowed!', EventCategory.buff);
    if (me.isPlayer) g.flash(msg);
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
  private freeze(me: Mob, g: GameIF, move: boolean): boolean {
    if (!me.is(Buff.Freeze)) return false;
    if (move && g.rand.isOneIn(2)) return false;
    const msg = new LogMessage('You are frozen!', EventCategory.buff);
    if (me.isPlayer) g.flash(msg);
    return true;
  }

  /**
   * Checks if the mob is confused and updates the direction accordingly.
   *
   * @param {GameIF} g - The game interface for handling randomness.
   * @param {WorldPoint} dir - The direction to update.
   * @returns {boolean} Whether the mob is confused or not.
   */
  public confused(g: GameIF, dir: WorldPoint): boolean {
    if (!this.me.is(Buff.Confuse)) return false;

    const r = g.rand;
    if (r.isOneIn(2)) return false;
    const msg = new LogMessage('You are confused!', EventCategory.buff);
    if (this.me.isPlayer) g.flash(msg);

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
