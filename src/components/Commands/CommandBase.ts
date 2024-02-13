import { GameIF } from '../../interfaces/Builder/Game';
import { Command } from '../../interfaces/Commands/Command';
import { Mob } from '../Mobs/Mob';

/**
 * Abstract class representing a base command implementation that implements the Command interface.
 */
export abstract class CommandBase implements Command {

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
   * Executes a turn for the mob.
   * @returns {boolean} The result of executing the command.
   */
  public turn(): boolean {
    return this.execute();
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
