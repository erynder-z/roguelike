import { WorldPoint } from '../../MapModel/WorldPoint';
import { Mob } from '../../Mobs/Mob';

export interface StepIF {
  executeStep(): StepIF | null;
  setPos(pos: WorldPoint): void;
  setDirection(dir: WorldPoint): void;
  setTarget(tgt: Mob): void;
  setTime(time: number): void;
}
