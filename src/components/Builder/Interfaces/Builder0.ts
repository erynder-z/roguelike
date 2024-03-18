import { RandomGenerator } from '../../RandomGenerator/RandomGenerator';
import { Map } from '../../MapModel/Interfaces/Map';
import { GameIF } from './Game';

/**
 * Interface representing a builder for creating game instances and maps.
 */
export interface Build0 {
  makeGame(): GameIF;
  makeLevel(rnd: RandomGenerator, level: number): Map;
  makeMap(rnd: RandomGenerator, level: number): Map;
}
