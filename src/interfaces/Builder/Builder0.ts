import { RandomGenerator } from '../../components/MapModel/RandomGenerator';
import { Map } from '../Map/Map';
import { GameIF } from './Game';

/**
 * Interface representing a builder for creating game instances and maps.
 */
export interface Build0 {
  makeGame(): GameIF;
  makeLevel(rnd: RandomGenerator, level: number): Map;
  makeMap(rnd: RandomGenerator, level: number): Map;
}
