import { Buff } from '../buffs/buffEnum';
import { CommandBase } from './commandBase';
import { EventCategory } from '../messages/logMessage';
import { GameState } from '../../gameBuilder/types/gameState';
import { Mob } from '../mobs/mob';
import { MoveBumpCommand } from './moveBumpCommand';

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