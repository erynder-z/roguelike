import { MapIF } from '../MapModel/Interfaces/MapIF';
import { GameMap } from '../MapModel/GameMap';
import { Glyph } from '../Glyphs/Glyph';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';

export class MapGenerator_Cave {
  constructor(
    public map: MapIF,
    public rnd: RandomGenerator,
  ) {}

  public createCave(map: MapIF, rnd: RandomGenerator): MapIF {
    // Clear map
    this.clearMap();

    // Generate cave-like environment using Drunkard's Walk algorithm
    const wallProbability = 0.5; // Adjust to control density of walls
    const maxIterations = 15000; // Adjust as needed

    let x = Math.floor(map.dimensions.x / 2);
    let y = Math.floor(map.dimensions.y / 2);

    for (let i = 0; i < maxIterations; i++) {
      // Mark current cell as floor
      this.map.cell(new WorldPoint(x, y)).env = Glyph.Floor;

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
            this.map.cell(new WorldPoint(x + dx, y + dy)).env = Glyph.Rock;
          }
        }
      }
    }

    return map;
  }

  clearMap(): void {
    // Reset all cells to default
    for (let y = 0; y < this.map.dimensions.y; y++) {
      for (let x = 0; x < this.map.dimensions.x; x++) {
        this.map.cell(new WorldPoint(x, y)).env = Glyph.Rock;
      }
    }
  }

  randomDirection(): number[] {
    // Randomly choose a direction
    const directions = [
      [0, 1], // Up
      [0, -1], // Down
      [1, 0], // Right
      [-1, 0], // Left
    ];
    return directions[Math.floor(Math.random() * directions.length)];
  }

  public static generate(rnd: RandomGenerator, level: number): MapIF {
    const mapDimensionsX = 128;
    const mapDimensionsY = 64;
    const mapDimensions = new WorldPoint(mapDimensionsX, mapDimensionsY);
    const map = new GameMap(mapDimensions, Glyph.Rock, level);

    const generator = new MapGenerator_Cave(map, rnd);

    return generator.createCave(map, rnd);
  }
}
