import { GameIF } from '../Builder/Interfaces/Game';
import { GameMap } from '../MapModel/GameMap';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';
import { HitCommand } from './HitCommand';
import { MoveCommand } from './MoveCommand';

/**
 * Represents a command to move and potentially bump into a target.
 * @extends CommandBase
 */
export class MoveBumpCommand extends CommandBase {
  /**
   * Creates an instance of MoveBumpCommand.
   * @param {WorldPoint} dir - The direction to move in.
   * @param {Mob} mob - The mobile entity performing the move.
   * @param {GameIF} game - The game interface.
   */
  constructor(
    public dir: WorldPoint,
    public mob: Mob,
    public game: GameIF,
  ) {
    super();
  }

  /**
   * Executes the function and returns a boolean value.
   *
   * @return {boolean} the result of the function execution
   */
  execute(): boolean {
    const np = this.dir.plus(this.mob.pos);
    const map = <GameMap>this.game.currentMap();
    if (!map.isLegalPoint(np)) return false;
    const cell = map.cell(np);
    return cell.mob
      ? new HitCommand(this.mob, cell.mob, this.game).execute()
      : new MoveCommand(this.dir, this.mob, this.game).execute();
  }
}
