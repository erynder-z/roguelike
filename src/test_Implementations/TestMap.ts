import { GameMap } from '../components/MapModel/GameMap';
import { Glyph } from '../components/MapModel/Glyph';
import { WorldPoint } from '../components/MapModel/WorldPoint';
import { Map } from '../interfaces/Map/Map';

export class TestMap {
  static test(): Map {
    const windowDimensions = new WorldPoint(14, 8);
    const level = 0;
    return new GameMap(windowDimensions, Glyph.Wall, level);
  }
}
