import { WorldPoint } from '../../MapModel/WorldPoint';
import { Mob } from '../../Mobs/Mob';
import { GameIF } from '../../Builder/Interfaces/Game';

/**
 * Interface representing a command that can be executed.
 */
export interface Command {
  execute(): boolean;
  turn(): boolean;
  raw(): boolean;
  npcTurn(): boolean;
  setDirection(direction: WorldPoint): Command;
  me: Mob;
  g: GameIF;
}
