import { CommandBase } from './CommandBase';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Mob } from '../Mobs/Mob';
import { Buff } from '../Buffs/BuffEnum';
import { MoveBumpCommand } from './MoveBumpCommand';

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
    const { me, game } = this;
    const isConfused = me.is(Buff.Confuse);

    if (isConfused) {
      const randomDirection = game.rand.randomDirectionForcedMovement();
      return new MoveBumpCommand(randomDirection, me, game).execute();
    }

    game.addCurrentEvent(EventCategory.wait);

    return !isConfused;
  }
}
