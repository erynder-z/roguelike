import { CommandBase } from './CommandBase';
import { GameState } from '../Builder/Types/GameState';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';

/**
 * Represents a command that removes all buffs from the given mob.
 */
export class CleanseAllCommand extends CommandBase {
  constructor(
    public me: Mob,
    public game: GameState,
  ) {
    super(me, game);
  }

  /**
   * Executes the cleanse all command, removing all buffs from the mob.
   *
   * @return {boolean} Returns true if the command was executed successfully.
   */
  public execute(): boolean {
    const { me, game } = this;

    me.buffs._map.clear();

    const msg = new LogMessage(`Cleansed all buffs!`, EventCategory.heal);

    game.message(msg);

    return true;
  }
}
