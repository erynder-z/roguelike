import { GameIF } from '../Builder/Interfaces/GameIF';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';

/**
 * Represents a command that removes all buffs from the given mob.
 */
export class CleanseAllCommand extends CommandBase {
  constructor(
    public me: Mob,
    public game: GameIF,
  ) {
    super(me, game);
  }

  /**
   * Executes the cleanse all command, removing all buffs from the mob.
   *
   * @return {boolean} Returns true if the command was executed successfully.
   */
  public execute(): boolean {
    const g = this.game;
    const me = this.me;

    me.buffs._map.clear();

    const msg = new LogMessage(`Cleansed all buffs!`, EventCategory.heal);

    g.message(msg);

    return true;
  }
}
