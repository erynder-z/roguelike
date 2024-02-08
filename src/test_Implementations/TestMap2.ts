import { GameMap } from '../components/MapModel/GameMap';
import { Glyph } from '../components/MapModel/Glyph';
import { RandomGenerator } from '../components/MapModel/RandomGenerator';
import { WorldPoint } from '../components/MapModel/WorldPoint';
import { Map } from '../interfaces/Map/Map';

export class TestMap2 {
  static test(dim: WorldPoint, rnd: RandomGenerator, level: number): Map {
    const m = new GameMap(dim, Glyph.Wall, level);
    for (let p = new WorldPoint(); p.y < dim.y; p.y++) {
      for (p.x = 0; p.x < dim.x; p.x++) {
        const edge = !(
          p.x > 0 &&
          p.x < dim.x - 1 &&
          p.y > 0 &&
          p.y < dim.y - 1
        );
        const chance = rnd.isOneIn(4);
        const wall = edge || chance;
        m.getCell(p).env = wall ? Glyph.Wall : Glyph.Floor;
      }
    }
    return m;
  }

  static fullTest(): Map {
    const wdim = new WorldPoint(32, 16);
    const rnd = new RandomGenerator(42);
    return TestMap2.test(wdim, rnd, 0);
  }
}
