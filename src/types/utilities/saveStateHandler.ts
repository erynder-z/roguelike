import { Buff } from '../../gameLogic/buffs/buffEnum';
import { GameConfigType } from '../gameConfig/gameConfigType';
import { GameState } from '../gameBuilder/gameState';
import { ItemObject } from '../../gameLogic/itemObjects/itemObject';
import { Slot } from '../../gameLogic/itemObjects/slot';

export type SerializedGameState = {
  serializedAI: { id: string; data: GameState['ai'] };
  serializedLog: { id: string; data: GameState['log'] };
  serializedDungeon: { id: string; data: GameState['dungeon'] };
  serializedAutoHeal: { id: string; data: GameState['autoHeal'] };
  serializedInventory: { id: string; data: GameState['inventory'] };
  serializedEquipment: { id: string; data: [Slot, ItemObject][] };
  serializedStats: { id: string; data: GameState['stats'] };
  serializedPlayer: { id: string; data: GameState['player'] };
  serializedPlayerBuffs: {
    id: string;
    data: { buff: Buff; duration: number }[];
  };
  serializedBuild: { id: string; data: GameState['build'] };
  playerConfig: GameConfigType['player'];
};
