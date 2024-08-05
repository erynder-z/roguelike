import { GameState } from './GameState';
import { Glyph } from '../../Glyphs/Glyph';
import { Map } from '../../MapModel/Types/Map';
import { Mob } from '../../Mobs/Mob';
import { MobAI } from '../../Mobs/Types/MobAI';
import { RandomGenerator } from '../../RandomGenerator/RandomGenerator';
import { WorldPoint } from '../../MapModel/WorldPoint';

export type Build = {
  makeGame(): GameState;
  makeLevel(rand: RandomGenerator, level: number): Map;
  makeMap(rand: RandomGenerator, level: number): Map;
  makePlayer(): Mob;
  makeAI(): MobAI | null;
  addNPC(glyph: Glyph, x: number, y: number, map: Map, level: number): Mob;
  addMapLevel_Mob(pos: WorldPoint, map: Map, rand: RandomGenerator): void;
};
