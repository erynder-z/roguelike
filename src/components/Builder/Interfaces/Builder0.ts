import { RandomGenerator } from '../../RandomGenerator/RandomGenerator';
import { MapIF } from '../../MapModel/Interfaces/MapIF';
import { GameIF } from './Game';

/**
 * Interface representing a builder for creating game instances and maps.
 */
export interface Build0 {
  makeGame(): GameIF;
  makeLevel(rnd: RandomGenerator, level: number): MapIF;
  makeMap(rnd: RandomGenerator, level: number): MapIF;
}
