import { GameMap } from '../MapModel/GameMap';
import { Glyph } from '../MapModel/Glyph';
import { RandomGenerator } from '../MapModel/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';

export class MapGenerator_Maze {
  constructor(
    public map: GameMap,
    public rnd: RandomGenerator,
  ) {}

  public generate(): GameMap {
    this.carveMaze();
    return this.map;
  }

  carveMaze(): void {
    const map = this.map;
    const rnd = this.rnd;

    // Initialize the maze with walls
    for (let y = 0; y < map.dimensions.y; y++) {
      for (let x = 0; x < map.dimensions.x; x++) {
        map.cell(new WorldPoint(x, y)).env = Glyph.Wall;
      }
    }

    // Start carving the maze from a random cell
    const startX = rnd.randomInteger(1, map.dimensions.x - 2);
    const startY = rnd.randomInteger(1, map.dimensions.y - 2);
    const startCell = new WorldPoint(startX, startY);
    this.carvePassage(startCell);
  }

  carvePassage(currentCell: WorldPoint): void {
    const map = this.map;
    const rnd = this.rnd;

    const [x, y] = [currentCell.x, currentCell.y];
    map.cell(currentCell).env = Glyph.Floor;

    // Define possible directions
    const directions = this.shuffle([
      new WorldPoint(x + 2, y),
      new WorldPoint(x - 2, y),
      new WorldPoint(x, y + 2),
      new WorldPoint(x, y - 2),
    ]);

    for (const dir of directions) {
      const [nx, ny] = [dir.x, dir.y];
      // Check if the neighbor is within bounds and unvisited
      if (
        nx > 0 &&
        nx < map.dimensions.x - 1 &&
        ny > 0 &&
        ny < map.dimensions.y - 1 &&
        map.cell(dir).env === Glyph.Wall
      ) {
        // Carve passage to the neighbor
        const midX = (x + nx) / 2;
        const midY = (y + ny) / 2;
        map.cell(new WorldPoint(midX, midY)).env = Glyph.Floor;

        // Randomly decide whether to add a door
        if (rnd.isOneIn(25)) {
          map.cell(new WorldPoint(midX, midY)).env = Glyph.Door_Closed;
        }

        this.carvePassage(dir);
      }
    }
  }

  shuffle(array: WorldPoint[]): WorldPoint[] {
    const rnd = this.rnd;
    for (let i = array.length - 1; i > 0; i--) {
      const j = rnd.randomInteger(0, i);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  public static test(level: number): GameMap {
    const mapDimensionsX = 64;
    const mapDimensionsY = 32;
    const mapDimensions = new WorldPoint(mapDimensionsX, mapDimensionsY);
    const map = new GameMap(mapDimensions, Glyph.Wall, level);

    const generateRandomInteger = () => {
      const min = 1;
      const max = 9999;
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const randomSeed = generateRandomInteger();

    const rnd = new RandomGenerator(randomSeed);
    const generator = new MapGenerator_Maze(map, rnd);

    return generator.generate();
  }
}
