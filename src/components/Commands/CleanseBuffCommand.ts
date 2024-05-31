import { Buff } from '../Buffs/BuffEnum';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';

/**
 * Represents a command that removes a given buff from the given mob.
 */
export class CleanseBuffCommand extends CommandBase {
  constructor(
    public buff: Buff,
    public me: Mob,
    public game: GameIF,
  ) {
    super(me, game);
  }

  /**
   * Executes the command to cleanse a specific buff from the mob.
   *
   * @return {boolean} Returns true if the command was executed successfully.
   */
  execute(): boolean {
    const g = this.game;
    const me = this.me;

    if (this.buff) this.me.buffs.cleanse(this.buff, g, me);

    const msg = new LogMessage(`Cleansed ${this.buff}!`, EventCategory.heal);

    g.message(msg);

    return true;
  }
}
