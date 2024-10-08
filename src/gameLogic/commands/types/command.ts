import { Cost } from './cost';
import { GameState } from '../../../gameBuilder/types/gameState';
import { Mob } from '../../mobs/mob';
import { WorldPoint } from '../../../maps/mapModel/worldPoint';

export type Command = {
  me: Mob;
  game: GameState;
  cost?: Cost;
  target?: Mob;
  execute(): boolean;
  turn(): boolean;
  raw(): boolean;
  npcTurn(): boolean;
  setDirection(direction: WorldPoint): Command;
  setCost(cost?: Cost): void;
  setTarget(target: Mob): void;
};
