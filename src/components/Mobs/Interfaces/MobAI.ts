import { Mob } from '../Mob';
import { GameIF } from '../../Builder/Interfaces/Game';

export interface MobAI {
  turn(me: Mob, enemy: Mob, game: GameIF): boolean;
}
