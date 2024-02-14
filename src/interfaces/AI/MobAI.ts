import { Mob } from '../../components/Mobs/Mob';
import { GameIF } from '../Builder/Game';

export interface MobAI {
  turn(me: Mob, enemy: Mob, game: GameIF): boolean;
}
