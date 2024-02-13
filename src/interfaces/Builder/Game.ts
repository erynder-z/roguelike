import { RandomGenerator } from '../../components/MapModel/RandomGenerator';
import { Mob } from '../../components/Mobs/Mob';
import { Map } from '../Map/Map';

/**
 * Represents the interface for the game.
 */
export interface GameIF {
  rand: RandomGenerator;
  currentMap(): Map | null;
  player: Mob;
}
