import { MessageLog } from '../../components/Messages/MessageLog';
import { RandomGenerator } from '../../components/MapModel/RandomGenerator';
import { Mob } from '../../components/Mobs/Mob';
import { MobAI } from '../AI/MobAI';
import { Map } from '../Map/Map';
import { Build0 } from './Builder0';
import { Dungeon } from '../../components/MapModel/Dungeon';

/**
 * Represents the interface for the game.
 */
export interface GameIF {
  rand: RandomGenerator;
  currentMap(): Map | null;
  player: Mob;
  ai: MobAI | null;
  message(s: string): void;
  log: MessageLog;
  dungeon: Dungeon;
  build: Build0;
}
