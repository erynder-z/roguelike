import { MapIF } from '../../MapModel/Interfaces/MapIF';
import { MobAI } from '../../Mobs/Interfaces/MobAI';
import { Mob } from '../../Mobs/Mob';
import { RandomGenerator } from '../../RandomGenerator/RandomGenerator';
import { GameIF } from './GameIF';

/**
 * Represents an extended version of Build1 interface with additional method to make MobAI.
 */
export interface BuildIF {
  makeGame(): GameIF;
  makeLevel(rnd: RandomGenerator, level: number): MapIF;
  makeMap(rnd: RandomGenerator, level: number): MapIF;
  makePlayer(): Mob;
  makeAI(): MobAI | null;
}
