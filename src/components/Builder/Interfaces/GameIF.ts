import { MessageLog } from '../../Messages/MessageLog';
import { RandomGenerator } from '../../RandomGenerator/RandomGenerator';
import { Mob } from '../../Mobs/Mob';
import { MobAI } from '../../Mobs/Interfaces/MobAI';
import { MapIF } from '../../MapModel/Interfaces/MapIF';
import { Builder } from '../Builder';
import { Dungeon } from '../../MapModel/Dungeon';
import { AutoHeal } from '../../Commands/AutoHeal';
import { Inventory } from '../../Inventory/Inventory';
import { Equipment } from '../../Inventory/Equipment';

/**
 * Represents the interface for the game.
 */
export interface GameIF {
  rand: RandomGenerator;
  currentMap(): MapIF | null;
  player: Mob;
  ai: MobAI | null;
  message(s: string): void;
  flash(s: string): void;
  log: MessageLog;
  dungeon: Dungeon;
  build: Builder;
  autoHeal: AutoHeal | undefined;
  inventory: Inventory | undefined;
  equipment: Equipment | undefined;
}
