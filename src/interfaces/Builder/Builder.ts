import { RandomGenerator } from '../../components/MapModel/RandomGenerator';
import { Map } from '../Map/Map';
import { GameIF } from './Game';

export interface Build {
  makeGame(): GameIF;
  makeLevel(rnd: RandomGenerator, level: number): Map;
  makeMap(rnd: RandomGenerator, level: number): Map;
}
