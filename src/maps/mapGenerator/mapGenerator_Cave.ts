import { CAVE_LEVEL_TILES } from './generationData/caveLevelTiles';
import { EnvironmentChecker } from '../../gameLogic/environment/environmentChecker';
import { GameMap } from '../mapModel/gameMap';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { Glyph } from '../../gameLogic/glyphs/glyph';
import { IrregularShapeAreaGenerator } from '../../utilities/irregularShapeAreaGenerator';
import { RandomGenerator } from '../../randomGenerator/randomGenerator';
import { RockGenerator } from './rockGenerator';
import { WorldPoint } from '../mapModel/worldPoint';

/**
 * GameMapType generator for cave-like environments using the Drunkard's Walk algorithm.
 */
export class MapGenerator_Cave {
  constructor(
    public map: GameMapType,
    public rand: RandomGenerator,
  ) {}

  public createCave(map: GameMapType, rand: RandomGenerator): GameMapType {
    // Clear map
    this.clearMap();

    // Generate cave-like environment using Drunkard's Walk algorithm
    const wallProbability = 0.5;
    const maxIterations = 15000;

    let x = Math.floor(map.dimensions.x / 2);
    let y = Math.floor(map.dimensions.y / 2);

    for (let i = 0; i < maxIterations; i++) {
      // Mark current cell as floor
      this.map.cell(new WorldPoint(x, y)).env = RockGenerator.getFloorRockTypes(
        rand,
        CAVE_LEVEL_TILES,
      );

      // Randomly move in any direction
      const direction = this.randomDirection();
      x += direction[0];
      y += direction[1];

      // Ensure within bounds
      if (
        x <= 1 ||
        y <= 1 ||
        x >= map.dimensions.x - 2 ||
        y >= map.dimensions.y - 2
      ) {
        // Reset position if out of bounds
        x = Math.floor(map.dimensions.x / 2);
        y = Math.floor(map.dimensions.y / 2);
        continue;
      }

      // Add walls in surrounding cells with a certain probability
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (
            (dx !== 0 || dy !== 0) && // Skip center cell
            rand.generateRandomNumber() < wallProbability &&
            this.map.cell(new WorldPoint(x + dx, y + dy)).env !==
              Glyph.Regular_Floor
          ) {
            this.map.cell(new WorldPoint(x + dx, y + dy)).env =
              RockGenerator.getWallRockTypes(rand, CAVE_LEVEL_TILES);
          }
        }
      }
    }
    this.addDeepWater(map, rand);
    this.addShallowWater(map, rand);
    this.addLava(map, rand);
    this.addMossyFloor(map, rand);
    this.addChasm(map, rand);
    this.processCells(map);

    return map;
  }

  private clearMap(): void {
    // Reset all cells to default
    for (let y = 0; y < this.map.dimensions.y; y++) {
      for (let x = 0; x < this.map.dimensions.x; x++) {
        this.map.cell(new WorldPoint(x, y)).env = Glyph.Rock;
      }
    }
  }

  private randomDirection(): number[] {
    // Randomly choose a direction
    const directions = [
      [0, 1], // Up
      [0, -1], // Down
      [1, 0], // Right
      [-1, 0], // Left
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  private addLava(map: GameMapType, rand: RandomGenerator): void {
    const glyph = Glyph.Lava;
    const lavaPoolCount = 10;
    const lavaPoolSize = 10;
    this.addPools(map, rand, lavaPoolCount, lavaPoolSize, glyph);
  }

  private addDeepWater(map: GameMapType, rand: RandomGenerator): void {
    const glyph = Glyph.Deep_Water;
    const waterPoolCount = 10;
    const waterPoolSize = 10;
    this.addPools(map, rand, waterPoolCount, waterPoolSize, glyph);
  }

  private addShallowWater(map: GameMapType, rand: RandomGenerator): void {
    const glyph = Glyph.Shallow_Water;
    const waterPoolCount = 10;
    const waterPoolSize = 10;
    this.addPools(map, rand, waterPoolCount, waterPoolSize, glyph);
  }

  private addPools(
    map: GameMapType,
    rand: RandomGenerator,
    poolCount: number,
    poolSize: number,
    glyph: Glyph,
  ): void {
    for (let i = 0; i < poolCount; i++) {
      if (rand.isOneIn(2)) this.createPools(map, rand, poolSize, glyph);
    }
  }

  private createPools(
    map: GameMapType,
    rand: RandomGenerator,
    size: number,
    glyph: Glyph,
  ): void {
    const lavaPool = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      map.dimensions,
      rand,
      size,
      10,
    );

    for (const point of lavaPool) {
      map.cell(point).env = glyph;
    }
  }

  private addMossyFloor(map: GameMapType, rand: RandomGenerator): void {
    const glyph = Glyph.Mossy_Floor;
    const mossyFloorCount = 10;
    const mossyFloorSize = 15;
    this.addMossyFloorPatches(
      map,
      rand,
      mossyFloorCount,
      mossyFloorSize,
      glyph,
    );
  }

  private addMossyFloorPatches(
    map: GameMapType,
    rand: RandomGenerator,
    patchCount: number,
    patchSize: number,
    glyph: Glyph,
  ): void {
    for (let i = 0; i < patchCount; i++) {
      if (rand.isOneIn(2))
        this.createMossyFloorPatches(map, rand, patchSize, glyph);
    }
  }

  private createMossyFloorPatches(
    map: GameMapType,
    rand: RandomGenerator,
    size: number,
    glyph: Glyph,
  ): void {
    const mossyFloorPatch =
      IrregularShapeAreaGenerator.generateIrregularShapeArea(
        map.dimensions,
        rand,
        size,
        10,
      );

    for (const point of mossyFloorPatch) {
      if (map.cell(point).env === Glyph.Regular_Floor)
        map.cell(point).env = glyph;
    }
  }

  private addChasm(map: GameMapType, rand: RandomGenerator): void {
    const centerGlyph = Glyph.Chasm_Center;
    const edgeGlyph = Glyph.Chasm_Edge;
    const chasmCount = 5;
    const chasmSize = 20;
    this.addChasmAreas(
      map,
      rand,
      chasmCount,
      chasmSize,
      centerGlyph,
      edgeGlyph,
    );
  }

  private addChasmAreas(
    map: GameMapType,
    rand: RandomGenerator,
    areaCount: number,
    areaSize: number,
    centerGlyph: Glyph,
    edgeGlyph: Glyph,
  ): void {
    for (let i = 0; i < areaCount; i++) {
      if (rand.isOneIn(2))
        this.createChasmAreas(map, rand, areaSize, centerGlyph, edgeGlyph);
    }
  }

  private createChasmAreas(
    map: GameMapType,
    rand: RandomGenerator,
    size: number,
    centerGlyph: Glyph,
    edgeGlyph: Glyph,
  ): void {
    const chasmArea = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      map.dimensions,
      rand,
      size,
      15,
    );

    for (const point of chasmArea) {
      map.cell(point).env = centerGlyph;
    }

    for (const point of chasmArea) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighbor = new WorldPoint(point.x + dx, point.y + dy);
          if (!neighbor.isPositionOutOfBounds(neighbor, map)) {
            if (
              (dx !== 0 || dy !== 0) &&
              map.cell(neighbor).env !== centerGlyph
            ) {
              map.cell(neighbor).env = edgeGlyph;
            }
          }
        }
      }
    }
  }

  /**
   * Loops over every cell on the map and applies any necessary modifications.
   * @param {GameMapType} map The map to process.
   */
  private processCells(map: GameMapType): void {
    for (let y = 0; y < map.dimensions.y; y++) {
      for (let x = 0; x < map.dimensions.x; x++) {
        const position = new WorldPoint(x, y);

        EnvironmentChecker.addStaticCellEffects(map.cell(position));
      }
    }
  }

  public static generate(rand: RandomGenerator, level: number): GameMapType {
    const mapDimensionsX = 64;
    const mapDimensionsY = 32;
    const mapDimensions = new WorldPoint(mapDimensionsX, mapDimensionsY);
    const map = new GameMap(mapDimensions, Glyph.Rock, level);

    const generator = new MapGenerator_Cave(map, rand);

    return generator.createCave(map, rand);
  }
}
