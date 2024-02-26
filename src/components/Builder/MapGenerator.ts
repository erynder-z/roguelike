import { Map } from '../../interfaces/Map/Map';
import { GameMap } from '../MapModel/GameMap';
import { Glyph } from '../MapModel/Glyph';
import { RandomGenerator } from '../MapModel/RandomGenerator';
import { WorldPoint } from '../MapModel/WorldPoint';
import { TerminalPoint } from '../Terminal/TerminalPoint';

/**
 * Generates a map for the game.
 */
export class MapGenerator1 {
  /**
   * Creates an instance of MapGenerator.
   * @param {Map} map - The map to generate.
   * @param {RandomGenerator} rnd - The random number generator.
   */
  constructor(
    public map: Map,
    public rnd: RandomGenerator,
  ) {}

  /**
   * Generates the map.
   * @param {Map} map - The map to generate.
   * @param {RandomGenerator} rnd - The random number generator.
   * @returns {Map} The generated map.
   */
  public generate(map: Map, rnd: RandomGenerator): Map {
    const numIterations = 30;
    const upperLeft = new WorldPoint();
    const roomDimensions = new WorldPoint();

    for (let n = 0; n < numIterations; ++n) {
      this.pickRandomPosition(upperLeft, roomDimensions);
      const filled = rnd.isOneIn(3);
      this.drawRoom(upperLeft, roomDimensions, filled);
    }
    return map;
  }

  /**
   * Picks a random position for a room.
   * @param {WorldPoint} upperLeft - The upper-left corner of the room.
   * @param {WorldPoint} dimensions - The dimensions of the room.
   */
  pickRandomPosition(upperLeft: WorldPoint, roomDimensions: WorldPoint): void {
    /*   const { x, y } = dimensions; */
    const rnd = this.rnd;
    const mapDimensions = this.map.dimensions;

    roomDimensions.y = rnd.randomIntegerClosedRange(2, 8);
    roomDimensions.x = rnd.randomIntegerClosedRange(4, 12);

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
   * @param {WorldPoint} upperLeft - The upper-left corner of the room.
   * @param {WorldPoint} dimensions - The dimensions of the room.
   * @param {boolean} filled - Indicates if the room should be filled.
   */
  drawRoom(
    upperLeft: WorldPoint,
    dimensions: WorldPoint,
    filled: boolean,
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
            ? Glyph.Wall
            : centerGlyph;
        this.map.cell(currentPoint).env = glyph;
        if (isSecondLayer) {
          doorPositions.push(currentPoint.copy());
        }
      }
      if (!filled) this.placeDoors(doorPositions);
    }
  }

  /**
   * Places doors in the room.
   * @param {WorldPoint[]} doorPositions - The positions where doors can be placed.
   */
  placeDoors(doorPositions: WorldPoint[]): void {
    const rnd = this.rnd;
    for (let i = rnd.randomInteger(1, 3); i >= 0; --i) {
      const index = rnd.randomInteger(0, doorPositions.length);
      const position = doorPositions[index];
      this.map.cell(position).env = Glyph.Door_Open;
    }
  }

  /**
   * Generates and returns a map for testing.
   * @param {number} level - The level of the map.
   * @returns {Map} The generated map.
   */
  public static test(level: number): Map {
    const terminalDimensions = TerminalPoint.StockDimensions;
    const worldDimensions = new WorldPoint(
      terminalDimensions.x,
      terminalDimensions.y,
    );
    const map = new GameMap(worldDimensions, Glyph.Rock, level);

    const rnd = new RandomGenerator(69);
    const generator = new MapGenerator1(map, rnd);

    return generator.generate(map, rnd);
  }
}
