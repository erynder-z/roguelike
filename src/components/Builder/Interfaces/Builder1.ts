import { Mob } from '../../Mobs/Mob';
import { Build0 } from './Builder0';

export interface Build1 extends Build0 {
  makePlayer(): Mob;
}
