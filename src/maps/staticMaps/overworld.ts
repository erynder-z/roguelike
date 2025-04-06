import { EnvironmentChecker } from '../../gameLogic/environment/environmentChecker';
import { FindFreeSpace } from '../helpers/findFreeSpace';
import { GameMap } from '../mapModel/gameMap';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { Glyph } from '../../gameLogic/glyphs/glyph';
import { IrregularShapeAreaGenerator } from '../helpers/irregularShapeAreaGenerator';
import { OVERWORLD_LEVEL_TILES } from '../mapGenerator/generationData/overworldLevelTiles';
import { RandomGenerator } from '../../randomGenerator/randomGenerator';
import { RockGenerator } from '../mapGenerator/rockGenerator';
import { WorldPoint } from '../mapModel/worldPoint';

export class Overworld {
  public static generate(rand: RandomGenerator, level: number): GameMapType {
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
        const chance = rand.isOneIn(4);

        if (chance) {
          m.cell(p).env = RockGenerator.getWallRockTypes(
            rand,
            OVERWORLD_LEVEL_TILES,
          );
        } else {
          m.cell(p).env = RockGenerator.getFloorRockTypes(
            rand,
            OVERWORLD_LEVEL_TILES,
          );
        }
        if (edge) {
          m.cell(p).env = Glyph.Rock;
        }
        EnvironmentChecker.addStaticCellEffects(m.cell(p));
      }
    }

    const lake = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      dim,
      rand,
      500,
      10,
    );

    for (const p of lake) {
      m.cell(p).env = Glyph.Deep_Water;
    }

    const puddle = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      dim,
      rand,
      20,
      10,
    );
    for (const p of puddle) {
      m.cell(p).env = Glyph.Shallow_Water;
    }

    const lavaPool = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      dim,
      rand,
      5,
      10,
    );
    for (const p of lavaPool) {
      m.cell(p).env = Glyph.Lava;
    }

    const freeSpace = FindFreeSpace.findFree(m, rand);
    if (freeSpace) m.cell(freeSpace).env = Glyph.Magnetite;

    const mossyFloorChance = rand.randomIntegerClosedRange(1, 100);
    if (mossyFloorChance <= 100) {
      for (let i = 0; i < mossyFloorChance; i++) {
        const mossyFloorArea =
          IrregularShapeAreaGenerator.generateIrregularShapeArea(
            dim,
            rand,
            rand.randomIntegerClosedRange(3, 10),
            5,
          );
        for (const p of mossyFloorArea) {
          if (m.cell(p).env === Glyph.Regular_Floor)
            m.cell(p).env = Glyph.Mossy_Floor;
        }
      }
    }

    return m;
  }
}
