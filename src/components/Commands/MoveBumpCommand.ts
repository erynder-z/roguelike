import { GameIF } from '../Builder/Interfaces/Game';
import { GameMap } from '../MapModel/GameMap';
import { WorldPoint } from '../MapModel/WorldPoint';
import { Mob } from '../Mobs/Mob';
import { Able } from './Able';
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
    public me: Mob,
    public game: GameIF,
  ) {
    super(me, game);
  }

  /**
   * Determines if a mob is able to perform a certain action.
   *
   * @param {Mob} m - The mob performing the action.
   * @param {GameIF} g - The game interface.
   * @param {Act} act - The action being performed.
   * @returns {Able} An object indicating if the mob is able to perform the action and if it uses a turn.
   */
  able(m: Mob, g: GameIF, act: Act): Able {
    return { isAble: true, usesTurn: false };
  }

  /**
   * Executes the function and returns a boolean value.
   *
   * @return {boolean} the result of the function execution
   */
  execute(): boolean {
    const np = this.dir.plus(this.me.pos);
    const map = <GameMap>this.game.currentMap();
    if (!map.isLegalPoint(np)) return false;
    const cell = map.cell(np);
    return cell.mob
      ? new HitCommand(this.me, cell.mob, this.game).turn()
      : new MoveCommand(this.dir, this.me, this.game).turn();
  }
}
