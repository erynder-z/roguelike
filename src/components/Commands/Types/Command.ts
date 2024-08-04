import { WorldPoint } from '../../MapModel/WorldPoint';
import { Mob } from '../../Mobs/Mob';
import { GameState } from '../../Builder/Types/GameState';
import { Cost } from './Cost';

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
