import { Glyph } from '../Glyphs/Glyph';
import { GameMap } from '../MapModel/GameMap';
import { Map } from '../MapModel/Types/Map';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { RockGenerator } from './RockGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Map generator for standard levels.
 */
export class MapGenerator1 {
  constructor(
    public map: Map,
    public rnd: RandomGenerator,
  ) {}

  /**
   * Generates a map.
   * @param {Map} map The map object to generate.
   * @param {RandomGenerator} rnd The random generator object.
   * @returns {Map} The generated map.
   */
  private loop(map: Map, rnd: RandomGenerator): Map {
    // Number of iterations for map generation
    const numIterations = 40;
    const upperLeft = new WorldPoint();
    const roomDimensions = new WorldPoint();

    for (let n = 0; n < numIterations; ++n) {
      this.pickRandomPosition(upperLeft, roomDimensions);
      const filled = rnd.isOneIn(3);
      this.drawRoom(upperLeft, roomDimensions, filled, rnd);
    }
    return map;
  }

  /**
   * Picks a random position for a room.
   * @param {WorldPoint} upperLeft The upper left corner of the room.
   * @param {WorldPoint} roomDimensions The dimensions of the room.
   */
  private pickRandomPosition(
    upperLeft: WorldPoint,
    roomDimensions: WorldPoint,
  ): void {
    const rnd = this.rnd;
    const mapDimensions = this.map.dimensions;

    roomDimensions.y = rnd.randomIntegerClosedRange(4, 16);
    roomDimensions.x = rnd.randomIntegerClosedRange(8, 24);

    if (rnd.isOneIn(2)) {
      const swap = roomDimensions.x;
      roomDimensions.x = roomDimensions.y;
      roomDimensions.y = swap;
    }

    upperLeft.x = rnd.randomInteger(1, mapDimensions.x - roomDimensions.x - 1);
    upperLeft.y = rnd.randomInteger(1, mapDimensions.y - roomDimensions.y - 1);
  }

  /**
   * Draws a room on the map.
   * @param {WorldPoint} upperLeft The upper left corner of the room.
   * @param {WorldPoint} dimensions The dimensions of the room.
   * @param {boolean} filled Whether the room is filled.
   */
  private drawRoom(
    upperLeft: WorldPoint,
    dimensions: WorldPoint,
    filled: boolean,
    rnd: RandomGenerator,
  ): void {
    const centerGlyph = filled ? Glyph.Wall : Glyph.Floor;
    const x2 = dimensions.x - 1;
    const y2 = dimensions.y - 1;
    const doorPositions: WorldPoint[] = [];
    const currentPoint = new WorldPoint();

    for (let y = 0; y <= dimensions.y; ++y) {
      currentPoint.y = y + upperLeft.y;
      for (let x = 0; x <= dimensions.x; ++x) {
        currentPoint.x = x + upperLeft.x;
        const isEdge =
          x === 0 || y === 0 || x === dimensions.x || y === dimensions.y;
        const isSecondLayer = x === 1 || y === 1 || x === x2 || y === y2;
        const glyph = isEdge
          ? Glyph.Floor
          : isSecondLayer
            ? RockGenerator.getRandomRockType(rnd)
            : centerGlyph;
        this.map.cell(currentPoint).env = glyph;
        if (isSecondLayer) {
          doorPositions.push(currentPoint.copy());
        }
      }
    }
    if (!filled) this.placeDoors(doorPositions);
  }

  /**
   * Places doors on the map.
   * @param {WorldPoint[]} doorPositions The positions for the doors.
   */
  private placeDoors(doorPositions: WorldPoint[]): void {
    const rnd = this.rnd;
    for (let i = rnd.randomInteger(1, 3); i >= 0; --i) {
      const index = rnd.randomInteger(0, doorPositions.length);
      const position = doorPositions[index];
      this.map.cell(position).env = Glyph.Door_Closed;
    }
  }

  /**
   * Generates an irregular shape area using cellular automata.
   *
   * @param {WorldPoint} dim - The dimensions of the area.
   * @param {RandomGenerator} rnd - The random number generator.
   * @param {number} iter - The number of iterations.
   * @return {Set<WorldPoint>} - The set of points representing the irregular shape area.
   */
  public static generateIrregularShapeArea(
    dim: WorldPoint,
    rnd: RandomGenerator,
    maxSize: number,
    iter: number,
  ): Set<WorldPoint> {
    const shape = new Set<WorldPoint>();
    // Initialize the shape with a random starting point
    const start = new WorldPoint(
      rnd.randomInteger(dim.x),
      rnd.randomInteger(dim.y),
    );
    shape.add(start);

    // Use cellular automata to grow the shape
    const iterations = iter;
    const maxShapeSize = maxSize;
    const offset = 2;

    for (let i = 0; i < iterations && shape.size < maxShapeSize; i++) {
      const newShape = new Set<WorldPoint>(shape);
      for (const p of shape) {
        const range = 1;
        const neighbors = p.getNeighbors(range);
        for (const neighbor of neighbors) {
          // Add neighboring points with a certain probability and if they're within the map bounds
          if (
            rnd.isOneIn(3) &&
            neighbor.x >= offset &&
            neighbor.x < dim.x &&
            neighbor.y >= offset &&
            neighbor.y < dim.y
          ) {
            newShape.add(neighbor);
          }
        }
      }
      shape.clear();
      for (const p of newShape) {
        shape.add(p);
      }
    }

    return shape;
  }

  /**
   * Generates a map and returns it.
   *
   * @param {WorldPoint} dim - The dimensions of the map.
   * @param {RandomGenerator} rnd - The random generator object.
   * @param {number} level - The level of the map.
   * @return {Map} The generated map.
   */
  public static generate(
    dim: WorldPoint,
    rnd: RandomGenerator,
    level: number,
  ): Map {
    const mapDimensionsX = dim.x;
    const mapDimensionsY = dim.y;
    const mapDimensions = new WorldPoint(mapDimensionsX, mapDimensionsY);
    const map = new GameMap(mapDimensions, Glyph.Rock, level);

    const generator = new MapGenerator1(map, rnd);

    return generator.loop(map, rnd);
  }
}
