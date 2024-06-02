import { Glyph } from '../../Glyphs/Glyph';
import { MapIF } from '../../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../../MapModel/WorldPoint';
import { MobAI } from '../../Mobs/Interfaces/MobAI';
import { Mob } from '../../Mobs/Mob';
import { RandomGenerator } from '../../RandomGenerator/RandomGenerator';
import { GameIF } from './GameIF';

/**
 * Represents an extended version of Build1 interface with additional method to make MobAI.
 */
export interface BuildIF {
  makeGame(): GameIF;
  makeLevel(rnd: RandomGenerator, level: number): MapIF;
  makeMap(rnd: RandomGenerator, level: number): MapIF;
  makePlayer(): Mob;
  makeAI(): MobAI | null;
  addNPC(glyph: Glyph, x: number, y: number, map: MapIF, level: number): Mob;
  addMapLevel_Mob(pos: WorldPoint, map: MapIF, rnd: RandomGenerator): void;
}
