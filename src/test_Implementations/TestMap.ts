import { GameMap } from '../components/MapModel/GameMap';
import { Glyph } from '../components/Glyphs/Glyph';
import { WorldPoint } from '../components/MapModel/WorldPoint';
import { MapIF } from '../components/MapModel/Interfaces/MapIF';

export class TestMap {
  static test(): MapIF {
    const windowDimensions = new WorldPoint(14, 8);
    const level = 0;
    return new GameMap(windowDimensions, Glyph.Wall, level);
  }
}
