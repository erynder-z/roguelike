import { Mob } from '../../components/Mobs/Mob';
import { GameIF } from '../Builder/Game';

/**
 * Interface representing a command that can be executed.
 */
export interface Command {
  execute(): boolean;
  turn(): boolean;
  raw(): boolean;
  npcTurn(): boolean;
  me: Mob;
  g: GameIF;
}
