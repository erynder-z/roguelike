import { MessageLog } from '../../Messages/MessageLog';
import { RandomGenerator } from '../../RandomGenerator/RandomGenerator';
import { Mob } from '../../Mobs/Mob';
import { MobAI } from '../../Mobs/Interfaces/MobAI';
import { Map } from '../../MapModel/Interfaces/Map';
import { Build0 } from './Builder0';
import { Dungeon } from '../../MapModel/Dungeon';
import { AutoHeal } from '../../Commands/AutoHeal';

/**
 * Represents the interface for the game.
 */
export interface GameIF {
  rand: RandomGenerator;
  currentMap(): Map | null;
  player: Mob;
  ai: MobAI | null;
  message(s: string): void;
  flash(s: string): void;
  log: MessageLog;
  dungeon: Dungeon;
  build: Build0;
  autoHeal: AutoHeal | undefined;
}
