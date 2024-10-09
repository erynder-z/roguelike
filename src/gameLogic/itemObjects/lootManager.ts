import { GameState } from '../../gameBuilder/types/gameState';
import { Map } from '../../maps/mapModel/types/map';
import { WorldPoint } from '../../maps/mapModel/worldPoint';
import { FindFreeSpace } from '../../utilities/findFreeSpace';
import { EnvironmentChecker } from '../environment/environmentChecker';
import { LogMessage, EventCategory } from '../messages/logMessage';
import { ItemObjectManager } from './itemObjectManager';

/**
 * Handles loot management.
 */
export class LootManager {
  /**
   * Attempts to drop loot at the given position on the map.
   *
   * @param {WorldPoint} pos - The position where the loot will be dropped.
   * @param {GameState} game - The current game state.
   * @param {number} level - The level of the loot.
   */
  public static dropLoot(
    pos: WorldPoint,
    game: GameState,
    level: number,
    maxDropRadius: number = 5,
  ): void {
    const map = <Map>game.currentMap();
    const lootCell = map.cell(pos);

    if (!EnvironmentChecker.canItemsBeDropped(lootCell)) {
      const np = FindFreeSpace.findFreeAdjacent(pos, map, maxDropRadius);
      if (!np) return;
      pos = np;
    }

    this.addLootAndLog(pos, map, game, level);
  }

  /**
   * Adds a random loot object at the specified position and logs the event.
   *
   * @param {WorldPoint} pos - The position where the loot will be added.
   * @param {Map} map - The game map.
   * @param {GameState} game - The game object.
   * @param {number} level - The level of the loot.
   */
  private static addLootAndLog(
    pos: WorldPoint,
    map: Map,
    game: GameState,
    level: number,
  ): void {
    const rand = game.rand;
    const objectLvl = level + 1;
    const obj = ItemObjectManager.addRandomObjectForLevel(
      pos,
      map,
      rand,
      objectLvl,
    );
    const msg = new LogMessage(
      `You notice a ${obj.name()} dropping on the floor.`,
      EventCategory.drop,
    );
    game.message(msg);
  }
}
