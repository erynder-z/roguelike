import { gameConfigManager } from '../gameConfigManager/gameConfigManager';
import { Buff } from '../gameLogic/buffs/buffEnum';
import { GameState } from '../types/gameBuilder/gameState';
import { SerializedGameState } from '../types/utilities/saveStateHandler';

export class SaveStateHandler {
  public static serialize(gameState: GameState): SerializedGameState {
    const gameConfig = gameConfigManager.getConfig();

    const ai = gameState.ai;
    const log = gameState.log;
    const dungeon = gameState.dungeon;
    const autoHeal = gameState.autoHeal;
    const inventory = gameState.inventory;
    const equipment = gameState.equipment;
    const stats = gameState.stats;
    const player = gameState.player;
    const build = gameState.build;

    const serializedAI = this.getAIJson(ai);
    const serializedLog = this.getLogJson(log);
    const serializedDungeon = this.getDungeonJson(dungeon);
    const serializedAutoHeal = this.getAutoHealJson(autoHeal);
    const serializedInventory = this.getInventoryJson(inventory);
    const serializedEquipment = this.getEquipmentJson(equipment);
    const serializedStats = this.getStatsJson(stats);
    const serializedPlayer = this.getPlayerJson(player);
    const serializedPlayerBuffs = this.getPlayerBuffsJson(player);
    const serializedBuild = this.getBuildJson(build);

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

  private static getAIJson(ai: GameState['ai']) {
    return {
      id: 'AI',
      data: ai,
    };
  }

  private static getLogJson(log: GameState['log']) {
    return {
      id: 'MESSAGELOG',
      data: log,
    };
  }

  private static getDungeonJson(dungeon: GameState['dungeon']) {
    // TODO: Also save mob buffs. Currently maps will not be saved!
    return {
      id: 'DUNGEON',
      data: dungeon,
    };
  }

  private static getAutoHealJson(autoHeal: GameState['autoHeal']) {
    return {
      id: 'AUTOHEAL',
      data: autoHeal,
    };
  }

  private static getInventoryJson(inventory: GameState['inventory']) {
    return {
      id: 'INVENTORY',
      data: inventory,
    };
  }

  private static getEquipmentJson(equipment: GameState['equipment']) {
    const objectifiedEquipment = equipment
      ? Array.from(equipment?._objs.entries())
      : [];
    return {
      id: 'EQUIPMENT',
      data: objectifiedEquipment,
    };
  }

  private static getStatsJson(stats: GameState['stats']) {
    return {
      id: 'STATS',
      data: stats,
    };
  }

  private static getPlayerJson(player: GameState['player']) {
    const playerClone = structuredClone(player);
    playerClone.buffs = player.buffs;
    return {
      id: 'PLAYER',
      data: playerClone,
    };
  }

  private static getPlayerBuffsJson(player: GameState['player']) {
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

  private static getBuildJson(build: GameState['build']) {
    return {
      id: 'BUILD',
      data: build,
    };
  }
}
