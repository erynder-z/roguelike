import { CAVE_LEVEL_TILES } from './GenerationData/CaveLevelTiles';
import { Glyph } from '../Glyphs/Glyph';
import { GameMap } from '../MapModel/GameMap';
import { IrregularShapeAreaGenerator } from '../Utilities/IrregularShapeAreaGenerator';
import { Map } from '../MapModel/Types/Map';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { RockGenerator } from './RockGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Map generator for cave-like environments using the Drunkard's Walk algorithm.
 */
export class MapGenerator_Cave {
  constructor(
    public map: Map,
    public rnd: RandomGenerator,
  ) {}

  public createCave(map: Map, rnd: RandomGenerator): Map {
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
        rnd,
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
            rnd.generateRandomNumber() < wallProbability &&
            this.map.cell(new WorldPoint(x + dx, y + dy)).env !== Glyph.Floor
          ) {
            this.map.cell(new WorldPoint(x + dx, y + dy)).env =
              RockGenerator.getWallRockTypes(rnd, CAVE_LEVEL_TILES);
          }
        }
      }
    }
    this.addDeepWater(map, rnd);
    this.addShallowWater(map, rnd);
    this.addLava(map, rnd);
    this.addMossyFloor(map, rnd);

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

  private addLava(map: Map, rnd: RandomGenerator): void {
    const glyph = Glyph.Lava;
    const lavaPoolCount = 10;
    const lavaPoolSize = 10;
    this.addPools(map, rnd, lavaPoolCount, lavaPoolSize, glyph);
  }

  private addDeepWater(map: Map, rnd: RandomGenerator): void {
    const glyph = Glyph.DeepWater;
    const waterPoolCount = 10;
    const waterPoolSize = 10;
    this.addPools(map, rnd, waterPoolCount, waterPoolSize, glyph);
  }

  private addShallowWater(map: Map, rnd: RandomGenerator): void {
    const glyph = Glyph.ShallowWater;
    const waterPoolCount = 10;
    const waterPoolSize = 10;
    this.addPools(map, rnd, waterPoolCount, waterPoolSize, glyph);
  }

  private addPools(
    map: Map,
    rnd: RandomGenerator,
    poolCount: number,
    poolSize: number,
    glyph: Glyph,
  ): void {
    for (let i = 0; i < poolCount; i++) {
      if (rnd.isOneIn(2)) this.createPools(map, rnd, poolSize, glyph);
    }
  }

  private createPools(
    map: Map,
    rnd: RandomGenerator,
    size: number,
    glyph: Glyph,
  ): void {
    const lavaPool = IrregularShapeAreaGenerator.generateIrregularShapeArea(
      map.dimensions,
      rnd,
      size,
      10,
    );

    for (const point of lavaPool) {
      map.cell(point).env = glyph;
    }
  }

  private addMossyFloor(map: Map, rnd: RandomGenerator): void {
    const glyph = Glyph.MossyFloor;
    const mossyFloorCount = 10;
    const mossyFloorSize = 15;
    this.addMossyFloorPatches(map, rnd, mossyFloorCount, mossyFloorSize, glyph);
  }

  private addMossyFloorPatches(
    map: Map,
    rnd: RandomGenerator,
    patchCount: number,
    patchSize: number,
    glyph: Glyph,
  ): void {
    for (let i = 0; i < patchCount; i++) {
      if (rnd.isOneIn(2))
        this.createMossyFloorPatches(map, rnd, patchSize, glyph);
    }
  }

  private createMossyFloorPatches(
    map: Map,
    rnd: RandomGenerator,
    size: number,
    glyph: Glyph,
  ): void {
    const mossyFloorPatch =
      IrregularShapeAreaGenerator.generateIrregularShapeArea(
        map.dimensions,
        rnd,
        size,
        10,
      );

    for (const point of mossyFloorPatch) {
      if (map.cell(point).env === Glyph.Floor) map.cell(point).env = glyph;
    }
  }

  public static generate(rnd: RandomGenerator, level: number): Map {
    const mapDimensionsX = 64;
    const mapDimensionsY = 32;
    const mapDimensions = new WorldPoint(mapDimensionsX, mapDimensionsY);
    const map = new GameMap(mapDimensions, Glyph.Rock, level);

    const generator = new MapGenerator_Cave(map, rnd);

    return generator.createCave(map, rnd);
  }
}
