import { Mob } from '../../Mobs/Mob';
import { WorldPoint } from '../../MapModel/WorldPoint';

export type Step = {
  executeStep(): Step | null;
  setPos(pos: WorldPoint): void;
  setDirection(dir: WorldPoint): void;
  setTarget(tgt: Mob): void;
  setTime(time: number): void;
};
