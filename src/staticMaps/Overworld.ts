import { GameMap } from '../components/MapModel/GameMap';
import { Glyph } from '../components/Glyphs/Glyph';
import { RandomGenerator } from '../components/RandomGenerator/RandomGenerator';
import { WorldPoint } from '../components/MapModel/WorldPoint';
import { MapIF } from '../components/MapModel/Interfaces/MapIF';

export class Overworld {
  static test(dim: WorldPoint, rnd: RandomGenerator, level: number): MapIF {
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
        m.cell(p).env = wall ? Glyph.Wall : Glyph.Floor;
      }
    }
    return m;
  }

  static fullTest(): MapIF {
    const wdim = new WorldPoint(32, 16);
    const rnd = new RandomGenerator(42);
    return Overworld.test(wdim, rnd, 0);
  }
}
