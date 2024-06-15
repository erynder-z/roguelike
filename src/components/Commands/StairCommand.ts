import { GameIF } from '../Builder/Interfaces/GameIF';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { FindFreeSpace } from '../Utilities/FindFreeSpace';
import { WorldPoint } from '../MapModel/WorldPoint';
import { CommandBase } from './CommandBase';
import { LogMessage, EventCategory } from '../Messages/LogMessage';

/**
 * Represents a command for handling stair movements in the game.
 */
export class StairCommand extends CommandBase {
  constructor(
    public levelDir: number,
    public game: GameIF,
  ) {
    super(game.player, game);
  }

  /**
   * Executes the stair command.
   * @returns {boolean} True if the command execution is successful, otherwise false.
   */
  execute(): boolean {
    const game = this.game;
    const dungeon = game.dungeon;
    const newLevel = dungeon.level + this.levelDir;
    const newMap: MapIF = dungeon.getLevel(newLevel, game);
    const newPos = FindFreeSpace.findFree(newMap, game.rand);
    const direction = this.levelDir != -1 ? 'descends' : 'ascends';
    const msg = new LogMessage(
      `Player ${direction} to level ${newLevel}.`,
      EventCategory.lvlChange,
    );
    this.game.message(msg);
    dungeon.playerSwitchLevel(newLevel, <WorldPoint>newPos, game);
    return true;
  }
}
