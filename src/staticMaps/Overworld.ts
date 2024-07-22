import { FindFreeSpace } from '../components/Utilities/FindFreeSpace';
import { GameMap } from '../components/MapModel/GameMap';
import { Glyph } from '../components/Glyphs/Glyph';
import { IrregularShapeAreaGenerator } from '../components/Utilities/IrregularShapeAreaGenerator';
import { Map } from '../components/MapModel/Types/Map';
import { OVERWORLD_LEVEL_TILES } from '../components/MapGenerator/GenerationData/OverworldLevelTiles';
import { RandomGenerator } from '../components/RandomGenerator/RandomGenerator';
import { RockGenerator } from '../components/MapGenerator/RockGenerator';
import { WorldPoint } from '../components/MapModel/WorldPoint';

export class Overworld {
  public static generate(rnd: RandomGenerator, level: number): Map {
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
          m.cell(p).env = RockGenerator.getWallRockTypes(
            rnd,
            OVERWORLD_LEVEL_TILES,
          );
        } else {
          m.cell(p).env = RockGenerator.getFloorRockTypes(
            rnd,
            OVERWORLD_LEVEL_TILES,
          );
        }
        if (edge) {
          m.cell(p).env = Glyph.Rock;
        }
      }
    }

    const lake = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      dim,
      rnd,
      500,
      10,
    );

    for (const p of lake) {
      m.cell(p).env = Glyph.DeepWater;
    }

    const puddle = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      dim,
      rnd,
      20,
      10,
    );
    for (const p of puddle) {
      m.cell(p).env = Glyph.ShallowWater;
    }

    const lavaPool = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      dim,
      rnd,
      5,
      10,
    );
    for (const p of lavaPool) {
      m.cell(p).env = Glyph.Lava;
    }

    const freeSpace = FindFreeSpace.findFree(m, rnd);
    if (freeSpace) m.cell(freeSpace).env = Glyph.Magnetite;

    const mossyFloorChance = rnd.randomIntegerClosedRange(1, 100);
    if (mossyFloorChance <= 100) {
      for (let i = 0; i < mossyFloorChance; i++) {
        const mossyFloorArea =
          IrregularShapeAreaGenerator.generateIrregularShapeArea(
            dim,
            rnd,
            rnd.randomIntegerClosedRange(3, 10),
            5,
          );
        for (const p of mossyFloorArea) {
          if (m.cell(p).env === Glyph.Floor) m.cell(p).env = Glyph.MossyFloor;
        }
      }
    }

    return m;
  }
}
