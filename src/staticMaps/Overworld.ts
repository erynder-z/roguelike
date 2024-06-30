import { GameMap } from '../components/MapModel/GameMap';
import { Glyph } from '../components/Glyphs/Glyph';
import { RandomGenerator } from '../components/RandomGenerator/RandomGenerator';
import { WorldPoint } from '../components/MapModel/WorldPoint';
import { MapIF } from '../components/MapModel/Interfaces/MapIF';
import { MapGenerator1 } from '../components/MapGenerator/MapGenerator';
import { RockGenerator } from '../components/MapGenerator/RockGenerator';
import { FindFreeSpace } from '../components/Utilities/FindFreeSpace';

export class Overworld {
  public static generate(rnd: RandomGenerator, level: number): MapIF {
    const mapDimensionsX = 64;
    const mapDimensionsY = 32;
    const dim = new WorldPoint(mapDimensionsX, mapDimensionsY);
    const m = new GameMap(dim, Glyph.Wall, level);

    for (let p = new WorldPoint(); p.y < mapDimensionsY; p.y++) {
      for (p.x = 0; p.x < mapDimensionsX; p.x++) {
        const edge = !(
          p.x > 0 &&
          p.x < mapDimensionsX - 1 &&
          p.y > 0 &&
          p.y < mapDimensionsY - 1
        );
        const chance = rnd.isOneIn(4);

        if (chance) {
          m.cell(p).env = RockGenerator.getRandomRockType(rnd);
        } else {
          m.cell(p).env = Glyph.Floor;
        }
        if (edge) {
          m.cell(p).env = Glyph.Rock;
        }
      }
    }

    const lake = MapGenerator1.generateIrregularShapeArea(dim, rnd, 500, 10);

    for (const p of lake) {
      m.cell(p).env = Glyph.DeepWater;
    }

    const puddle = MapGenerator1.generateIrregularShapeArea(dim, rnd, 20, 10);
    for (const p of puddle) {
      m.cell(p).env = Glyph.ShallowWater;
    }

    const lavaPool = MapGenerator1.generateIrregularShapeArea(dim, rnd, 5, 10);
    for (const p of lavaPool) {
      m.cell(p).env = Glyph.Lava;
    }

    const freeSpace = FindFreeSpace.findFree(m, rnd);

    if (freeSpace) m.cell(freeSpace).env = Glyph.Magnetite;

    return m;
  }
}
