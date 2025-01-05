import { ActiveBuffs } from '../gameLogic/buffs/activeBuffs';
import { Buff } from '../gameLogic/buffs/buffEnum';
import { BuffCommand } from '../gameLogic/commands/buffCommand';
import { Corpse } from '../gameLogic/mobs/corpse';
import { EquipCommand } from '../gameLogic/commands/equipCommand';
import { Game } from '../gameBuilder/gameModel';
import { gameConfigManager } from '../gameConfigManager/gameConfigManager';
import { GameMap } from '../maps/mapModel/gameMap';
import { GameState } from '../types/gameBuilder/gameState';
import { Glyph } from '../gameLogic/glyphs/glyph';
import { ItemObject } from '../gameLogic/itemObjects/itemObject';
import { Inventory } from '../gameLogic/inventory/inventory';
import { LogMessage } from '../gameLogic/messages/logMessage';
import { MapCell } from '../maps/mapModel/mapCell';
import { Mob } from '../gameLogic/mobs/mob';
import {
  ReadyToSaveGameState,
  SerializedCorpseData,
  SerializedDungeonData,
  SerializedGameMap,
  SerializedGameState,
  SerializedItemData,
  SerializedMapCell,
  SerializedMapCellArray,
  SerializedMobData,
} from '../types/utilities/saveStateHandler';
import { TurnQueue } from '../gameLogic/turnQueue/turnQueue';
import { WorldPoint } from '../maps/mapModel/worldPoint';

/**
 * Handles serializing and deserializing the game state to and from JSON.
 */
export class SaveStateHandler {
  /**
   * Prepares the game state for saving by serializing various components.
   * @param {GameState} gameState - The current game state to serialize.
   * @returns {ReadyToSaveGameState} - The serialized game state ready for saving.
   */
  public prepareForSave(gameState: GameState): ReadyToSaveGameState {
    const gameConfig = gameConfigManager.getConfig();

    const {
      ai,
      log,
      dungeon,
      autoHeal,
      inventory,
      equipment,
      stats,
      player,
      build,
    } = gameState;

    const serializedAI = this.getAIData(ai);
    const serializedLog = this.getLogData(log);
    const serializedDungeon = this.getDungeonData(dungeon);
    const serializedAutoHeal = this.getAutoHealData(autoHeal);
    const serializedInventory = this.getInventoryData(inventory);
    const serializedEquipment = this.getEquipmentData(equipment);
    const serializedStats = this.getStatsData(stats);
    const serializedPlayer = this.getPlayerData(player);
    const serializedPlayerBuffs = this.getPlayerBuffsData(player);
    const serializedBuild = this.getBuildData(build);

    const playerConfig = gameConfig.player;

    return {
      serializedAI,
      serializedLog,
      serializedDungeon,
      serializedAutoHeal,
      serializedInventory,
      serializedEquipment,
      serializedStats,
      serializedPlayer,
      serializedPlayerBuffs,
      serializedBuild,
      playerConfig,
    };
  }

  /**
   * Serializes the AI data.
   * @param {GameState['ai']} ai - The AI state of the game.
   * @returns {ReadyToSaveGameState['serializedAI']} - Serialized AI data.
   */
  private getAIData(ai: GameState['ai']): ReadyToSaveGameState['serializedAI'] {
    return {
      id: 'AI',
      data: ai,
    };
  }

  /**
   * Serializes the game log.
   * @param {GameState['log']} log - The game log.
   * @returns {ReadyToSaveGameState['serializedLog']} - Serialized log data.
   */
  private getLogData(
    log: GameState['log'],
  ): ReadyToSaveGameState['serializedLog'] {
    return {
      id: 'MESSAGELOG',
      data: log,
    };
  }

  /**
   * Serializes the dungeon data.
   * @param {GameState['dungeon']} dungeon - The game's dungeon data.
   * @returns {ReadyToSaveGameState['serializedDungeon']} - Serialized dungeon data.
   */
  private getDungeonData(
    dungeon: GameState['dungeon'],
  ): ReadyToSaveGameState['serializedDungeon'] {
    return {
      id: 'DUNGEON',
      data: dungeon,
    };
  }

  /**
   * Serializes the auto-heal state.
   * @param {GameState['autoHeal']} autoHeal - The game's auto-heal data.
   * @returns {ReadyToSaveGameState['serializedAutoHeal']} - Serialized auto-heal data.
   */
  private getAutoHealData(
    autoHeal: GameState['autoHeal'],
  ): ReadyToSaveGameState['serializedAutoHeal'] {
    return {
      id: 'AUTOHEAL',
      data: autoHeal,
    };
  }

  /**
   * Serializes the inventory data.
   * @param {GameState['inventory']} inventory - The player's inventory.
   * @returns {ReadyToSaveGameState['serializedInventory']} - Serialized inventory data.
   */
  private getInventoryData(
    inventory: GameState['inventory'],
  ): ReadyToSaveGameState['serializedInventory'] {
    return {
      id: 'INVENTORY',
      data: inventory,
    };
  }

  /**
   * Serializes the player's equipment.
   * @param {GameState['equipment']} equipment - The player's equipment.
   * @returns {ReadyToSaveGameState['serializedEquipment']} - Serialized equipment data.
   */
  private getEquipmentData(
    equipment: GameState['equipment'],
  ): ReadyToSaveGameState['serializedEquipment'] {
    const objectifiedEquipment = equipment
      ? Array.from(equipment?._objs.entries())
      : [];
    return {
      id: 'EQUIPMENT',
      data: objectifiedEquipment,
    };
  }

  /**
   * Serializes the player's stats.
   * @param {GameState['stats']} stats - The player's stats.
   * @returns {ReadyToSaveGameState['serializedStats']} - Serialized stats data.
   */
  private getStatsData(
    stats: GameState['stats'],
  ): ReadyToSaveGameState['serializedStats'] {
    return {
      id: 'STATS',
      data: stats,
    };
  }

  /**
   * Serializes the player object.
   * @param {GameState['player']} player - The player mob.
   * @returns {ReadyToSaveGameState['serializedPlayer']} - Serialized player data.
   */
  private getPlayerData(
    player: GameState['player'],
  ): ReadyToSaveGameState['serializedPlayer'] {
    const playerClone = structuredClone(player);
    playerClone.buffs = player.buffs;
    return {
      id: 'PLAYER',
      data: playerClone,
    };
  }

  /**
   * Serializes the player's active buffs.
   * @param {GameState['player']} player - The player mob.
   * @returns {ReadyToSaveGameState['serializedPlayerBuffs']} - Serialized buffs data.
   */
  private getPlayerBuffsData(
    player: GameState['player'],
  ): ReadyToSaveGameState['serializedPlayerBuffs'] {
    const buffsArray: { buff: Buff; duration: number }[] = [];
    const playerBuffs = player.buffs._map;

    playerBuffs.forEach((value, key) => {
      buffsArray.push({
        buff: key,
        duration: value.duration,
      });
    });

    return {
      id: 'PLAYERBUFFS',
      data: buffsArray,
    };
  }

  /**
   * Serializes the build data.
   * @param {GameState['build']} build - The current game build information.
   * @returns {ReadyToSaveGameState['serializedBuild']} - Serialized build data.
   */
  private getBuildData(
    build: GameState['build'],
  ): ReadyToSaveGameState['serializedBuild'] {
    return {
      id: 'BUILD',
      data: build,
    };
  }

  /**
   * Restores the dungeon state from the serialized data.
   * @param {Game} game - The current game instance to which the dungeon state will be restored.
   * @param {SerializedDungeonData} serializedDungeon - The serialized data containing the dungeon level and maps.
   * @returns {GameState} - The game state after restoring the dungeon.
   */
  public restoreDungeon(
    game: Game,
    serializedDungeon: SerializedDungeonData,
  ): GameState {
    this.setDungeonLevel(game, serializedDungeon.level);
    this.restoreDungeonMaps(game, serializedDungeon.maps);
    return game;
  }

  /**
   * Sets the current dungeon level.
   * @param {Game} game - The current game instance.
   * @param {number} level - The level to set.
   */
  private setDungeonLevel(game: Game, level: number): void {
    game.dungeon.level = level;
  }

  /**
   * Restores the dungeon maps from serialized data.
   * @param {Game} game - The current game instance where maps will be restored.
   * @param {SerializedGameMap[]} dungeonMaps - The serialized map data to restore.
   * @returns {void}
   */
  private restoreDungeonMaps(
    game: Game,
    dungeonMaps: SerializedGameMap[],
  ): void {
    game.dungeon.maps = dungeonMaps.map(map => this.restoreSingleMap(map));
  }

  /**
   * Restores a single map from the serialized data.
   * @param {SerializedGameMap} map - The serialized map data to restore.
   * @returns {GameMap} - The restored map.
   */
  private restoreSingleMap(map: SerializedGameMap): GameMap {
    const restoredCells = this.restoreMapCells(map.cells);

    const restoredMap = new GameMap(
      new WorldPoint(map.dimensions.x, map.dimensions.y),
      Glyph.Unknown,
      map.level,
      map.isDark,
      [],
      new WorldPoint(map.upStairPos?.x ?? 0, map.upStairPos?.y ?? 0),
      new WorldPoint(map.downStairPos?.x ?? 0, map.downStairPos?.y ?? 0),
      new TurnQueue(),
    );

    restoredMap.cells = restoredCells;

    this.restoreMapQueue(restoredMap);

    return restoredMap;
  }

  /**
   * Restores a 2D array of map cells from the serialized data.
   * @param {SerializedMapCellArray[]} cells - The serialized map cell data to restore.
   * @returns {MapCell[][]} - The restored 2D array of map cells.
   */
  private restoreMapCells(cells: SerializedMapCellArray[]): MapCell[][] {
    return cells.map(cellArray => this.restoreCellArray(cellArray));
  }

  /**
   * Restores a single 1D array of map cells from the serialized data.
   * @param {SerializedMapCellArray} cellArray - The serialized map cell data to restore.
   * @returns {MapCell[]} - The restored 1D array of map cells.
   */
  private restoreCellArray(cellArray: SerializedMapCellArray): MapCell[] {
    return cellArray.map(cell => this.restoreSingleCell(cell));
  }

  /**
   * Restores a single map cell from the serialized data.
   * @param {SerializedMapCell} cell - The serialized map cell data to restore.
   * @returns {MapCell} - The restored map cell.
   */
  private restoreSingleCell(cell: SerializedMapCell): MapCell {
    const newCell = new MapCell(cell.env);

    newCell.mob = cell.mob ? this.restoreMob(cell.mob) : undefined;
    newCell.lit = cell.lit;
    newCell.obj = cell.obj ? this.restoreItemObject(cell.obj) : undefined;
    newCell.sprite = cell.sprite ?? undefined;
    newCell.environment = {
      name: cell.environment?.name ?? '',
      description: cell.environment?.description ?? '',
      effects: cell.environment?.effects ?? [],
    };

    newCell.corpse = cell.corpse ? this.restoreCorpse(cell.corpse) : undefined;

    return newCell;
  }

  /**
   * Restores a single mob from the serialized data.
   * @param {SerializedMobData} serializedMob - The serialized mob data to restore.
   * @returns {Mob} - The restored mob.
   */
  private restoreMob(serializedMob: SerializedMobData): Mob {
    const mob = new Mob(
      serializedMob.glyph,
      serializedMob.pos.x,
      serializedMob.pos.y,
    );

    mob.id = serializedMob.id;
    mob.name = serializedMob.name;
    mob.description = serializedMob.description;
    mob.hp = serializedMob.hp;
    mob.maxhp = serializedMob.maxhp;
    mob.mood = serializedMob.mood;
    mob.level = serializedMob.level;
    mob.sinceMove = serializedMob.sinceMove;
    mob.isPlayer = serializedMob.isPlayer;
    mob.buffs = new ActiveBuffs();

    return mob;
  }

  /**
   * Restores a single item object from the serialized data.
   * @param {SerializedItemData} serializedItem - The serialized item object data to restore.
   * @returns {ItemObject} - The restored item object.
   */
  private restoreItemObject(serializedItem: SerializedItemData): ItemObject {
    return new ItemObject(
      serializedItem.glyph,
      serializedItem.slot,
      serializedItem.spell,
      serializedItem.level,
      serializedItem.desc,
      serializedItem.charges,
    );
  }

  /**
   * Restores a single corpse from the serialized data.
   * @param {SerializedCorpseData} serializedCorpse - The serialized corpse data to restore.
   * @returns {Corpse} - The restored corpse.
   */
  private restoreCorpse(serializedCorpse: SerializedCorpseData): Corpse {
    const corpse = new Corpse(
      serializedCorpse.glyph,
      serializedCorpse.pos.x,
      serializedCorpse.pos.y,
    );

    corpse.id = serializedCorpse.id;

    return corpse;
  }

  /**
   * Restores the mob queue for the given map.
   * @param {GameMap} map - The map to restore the mob queue for.
   */
  private restoreMapQueue(map: GameMap): void {
    const mapCells = map.cells;

    mapCells.map(cellArray => {
      cellArray.map(cell => {
        if (cell.mob) {
          map.queue.pushMob(cell.mob);
        }
      });
    });
  }

  /**
   * Restores the player's state from the given save state.
   *
   * @param {SerializedGameState} saveState - The save state to restore from.
   * @return {Mob} The restored player mob.
   */
  public restorePlayer(saveState: SerializedGameState): Mob {
    const playerPos = new WorldPoint(
      saveState.serializedPlayer.data.pos.x,
      saveState.serializedPlayer.data.pos.y,
    );

    const player = new Mob(Glyph.Player, playerPos.x, playerPos.y);
    player.name = saveState.serializedPlayer.data.name;
    player.hp = saveState.serializedPlayer.data.hp;
    player.maxhp = saveState.serializedPlayer.data.maxhp;
    player.level = saveState.serializedPlayer.data.level;
    return player;
  }

  /**
   * Restores the player's buffs from the given save state.
   *
   * @param {GameState} game - The game state.
   * @param {Mob} player - The player mob.
   * @param {SerializedGameState} saveState - The save state to restore from.
   * @return {GameState} The updated game state.
   */
  public restorePlayerBuffs(
    game: GameState,
    player: Mob,
    saveState: SerializedGameState,
  ): GameState {
    const buffs = saveState.serializedPlayerBuffs.data;
    for (const buff of buffs) {
      new BuffCommand(buff.buff, player, game, player, buff.duration).execute();
    }
    return game;
  }

  /**
   * Restores the player's inventory from the given save state.
   *
   * @param {Inventory} inv - The inventory to restore items into.
   * @param {SerializedGameState} saveState - The save state to restore from.
   * @return {GameState} The updated game state.
   */

  public restorePlayerInventory(
    game: GameState,
    saveState: SerializedGameState,
  ): GameState {
    const inv = <Inventory>game.inventory;
    const items = saveState.serializedInventory.data?.items;
    if (items) {
      for (const item of items) {
        inv.add(new ItemObject(item.glyph, item.slot, item.spell));
      }
    }
    return game;
  }

  /**
   * Restores the player's equipment from the given save state.
   *
   * @param {GameState} game - The game state.
   * @param {SerializedGameState} saveState - The save state to restore from.
   * @return {GameState} The updated game state.
   */
  public restorePlayerEquipment(
    game: GameState,
    saveState: SerializedGameState,
  ): GameState {
    const items = saveState.serializedEquipment.data;

    if (items) {
      for (const item of items) {
        const itm = new ItemObject(item[1].glyph, item[1].slot, item[1].spell);
        new EquipCommand(itm, item[0] as number, game).execute();
      }
    }
    return game;
  }

  /**
   * Restores the game log from the given save state.
   *
   * @param {Game} game - The game instance whose log is to be restored.
   * @param {SerializedGameState} saveState - The save state containing the serialized log data.
   * @returns {void} This function does not return anything.
   */

  public restoreLog(game: Game, saveState: SerializedGameState): void {
    const serializedLog = saveState.serializedLog.data;
    const log = game.log;

    serializedLog.archive.forEach(msg => {
      log.archive.push(new LogMessage(msg.message, msg.category));
    });
  }

  /**
   * Restores the player's stats from the given save state.
   *
   * This function updates the game's stats object with values from the serialized
   * stats in the save state. Default values are applied if the serialized data
   * lacks specific stats.
   *
   * @param {Game} game - The game instance whose stats are to be restored.
   * @param {SerializedGameState} saveState - The save state containing the
   * serialized stats data.
   * @returns {void} This function does not return anything.
   */

  public restoreStats(game: Game, saveState: SerializedGameState): void {
    const restoredStats = game.stats;
    const serializedStats = saveState.serializedStats.data;

    restoredStats.defaultVisRange = serializedStats.defaultVisRange || 50;
    restoredStats.currentVisRange = serializedStats.currentVisRange || 50;
    restoredStats.turnCounter = serializedStats.turnCounter || 1;
    restoredStats.mobKillCounter = serializedStats.mobKillCounter || 0;
    restoredStats.damageDealtCounter = serializedStats.damageDealtCounter || 0;
    restoredStats.damageReceivedCounter =
      serializedStats.damageReceivedCounter || 0;
    restoredStats.currentTurnReceivedDmg =
      serializedStats.currentTurnReceivedDmg || 0;
  }
}
