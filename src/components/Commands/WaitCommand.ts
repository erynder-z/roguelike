import { CommandBase } from './CommandBase';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Mob } from '../Mobs/Mob';

/**
 * Represents a wait command that ends the turn for the mob.
 */
export class WaitCommand extends CommandBase {
  constructor(
    public me: Mob,
    public game: GameState,
  ) {
    super(me, game);
  }
  /**
   * Executes the wait command.
   * @returns {boolean} Always returns true.
   */
  public execute(): boolean {
    const { game } = this;

    game.addCurrentEvent(EventCategory.wait);

    console.log('wait');

    return true;
  }
}
