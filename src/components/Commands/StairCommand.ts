import { CommandBase } from './CommandBase';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { FindFreeSpace } from '../Utilities/FindFreeSpace';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Represents a command for changing the level when using stairs.
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
  public execute(): boolean {
    const { game, levelDir } = this;
    const { dungeon } = game;
    const newLevel = dungeon.level + levelDir;
    const newMap = dungeon.getLevel(newLevel, game);
    const direction = levelDir !== -1 ? 'descends' : 'ascends';
    const newPos = this.getNewPos(direction, newMap, game);

    const message = new LogMessage(
      `Player ${direction} to level ${newLevel}.`,
      EventCategory.lvlChange,
    );
    game.message(message);
    dungeon.playerSwitchLevel(newLevel, newPos, game);
    return true;
  }

  /**
   * Returns the new position on the map based on the direction and the new map.
   *
   * @param {string} direction - The direction of movement ('ascends' or 'descends').
   * @param {MapIF} newMap - The new map to move to.
   * @param {GameIF} game - The game object.
   * @return {WorldPoint} The new position on the map.
   */
  private getNewPos(
    direction: string,
    newMap: MapIF,
    game: GameIF,
  ): WorldPoint {
    if (newMap.downStairPos && direction === 'ascends') {
      return newMap.downStairPos;
    } else if (newMap.upStairPos && direction === 'descends') {
      return newMap.upStairPos;
    } else {
      return FindFreeSpace.findFree(newMap, game.rand);
    }
  }
}
