import { MapCell } from '../MapCell';
import { WorldPoint } from '../WorldPoint';
import { Mob } from '../../Mobs/Mob';
import { TurnQueue } from '../../TurnQueue/TurnQueue';
import { ItemObject } from '../../ItemObjects/ItemObject';
import { Glyph } from '../../Glyphs/Glyph';
/**
 * Represents a game map with cells and dimensions.
 */
export interface MapIF {
  dimensions: WorldPoint;
  level: number;
  upStairPos?: WorldPoint;
  downStairPos?: WorldPoint;
  queue: TurnQueue;

  cell(p: WorldPoint): MapCell;

  isLegalPoint(p: WorldPoint): boolean;

  addNPC(m: Mob): Mob;

  enterMap(player: Mob, np: WorldPoint): void;

  addStairInfo(glyph: Glyph.StairsUp | Glyph.StairsDown, pos: WorldPoint): void;

  moveMob(m: Mob, p: WorldPoint): void;

  removeMob(m: Mob): void;

  isBlocked(p: WorldPoint): boolean;

  addObject(o: ItemObject, p: WorldPoint): void;

  forEachCell(action: (cell: MapCell, p: WorldPoint) => void): void;

  setEnvironmentDescriptions(): void;
}
