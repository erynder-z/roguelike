import { GameIF } from '../Builder/Interfaces/Game';
import { Map } from '../MapModel/Interfaces/Map';
import { FindFreeSpace } from '../Utilities/FindFreeSpace';
import { WorldPoint } from '../MapModel/WorldPoint';
import { CommandBase } from './CommandBase';

/**
 * Represents a command for handling stair movements in the game.
 */
export class StairCommand extends CommandBase {
  /**
   * Creates an instance of StairCommand.
   * @param {number} levelDir - The direction of the level change (1 for descending, -1 for ascending).
   * @param {GameIF} game - The game interface.
   */
  constructor(
    public levelDir: number,
    public game: GameIF,
  ) {
    super();
  }

  /**
   * Executes the stair command.
   * @returns {boolean} True if the command execution is successful, otherwise false.
   */
  execute(): boolean {
    const game = this.game;
    const dungeon = game.dungeon;
    const newLevel = dungeon.level + this.levelDir;
    const newMap: Map = dungeon.getLevel(newLevel, game);
    const newPos = FindFreeSpace.findFree(newMap, game.rand);
    const direction = this.levelDir != -1 ? 'descends' : 'ascends';
    this.game.message(`Player ${direction} to level ${newLevel}.`);
    dungeon.playerSwitchLevel(newLevel, <WorldPoint>newPos, game);
    return true;
  }
}
