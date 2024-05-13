import { GameIF } from '../Builder/Interfaces/GameIF';
import { MessageCategory } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';

/**
 * Represents a wait command that extends the functionality of the base command.
 */
export class WaitCommand extends CommandBase {
  constructor(
    public me: Mob,
    public game: GameIF,
  ) {
    super(me, game);
  }
  /**
   * Executes the wait command.
   * @returns {boolean} Always returns true.
   */
  execute(): boolean {
    const g = this.game;

    g.addCurrentEvent(MessageCategory.wait);

    console.log('wait');

    return true;
  }
}
