import { RandomGenerator } from '../../components/MapModel/RandomGenerator';
import { Map } from '../Map/Map';

export interface GameIF {
  rnd: RandomGenerator;
  currentMap(): Map | null;
}
