import { GameState } from './gameState';
import { Glyph } from '../../gameLogic/glyphs/glyph';
import { Map } from '../gameLogic/maps/mapModel/map';
import { Mob } from '../../gameLogic/mobs/mob';
import { MobAI } from '../gameLogic/mobs/mobAI';
import { RandomGenerator } from '../../randomGenerator/randomGenerator';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

export type Build = {
  makeGame(): GameState;
  makeLevel(rand: RandomGenerator, level: number): Map;
  makeMap(rand: RandomGenerator, level: number): Map;
  makePlayer(): Mob;
  makeAI(): MobAI | null;
  addNPC(glyph: Glyph, x: number, y: number, map: Map, level: number): Mob;
  addMapLevel_Mob(pos: WorldPoint, map: Map, rand: RandomGenerator): void;
};
