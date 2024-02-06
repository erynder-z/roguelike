import { Map } from '../../interfaces/Map/Map';
import { Glyph } from './Glyph';
import { MapCell } from './MapCell';
import { WorldPoint } from './WorldPoint';

/**
 * Represents the game map implementing the Map interface.
 */
export class GameMap implements Map {
  /**
   * 2D array of map cells representing the game map.
   */
  cells: MapCell[][];

  /**
   * Creates an instance of GameMap.
   * @param {WorldPoint} dimensions - The dimensions of the game map.
   * @param {Glyph} g_empty - The default glyph for empty cells.
   * @param {number} level - The level of the game map.
   */
  constructor(
    public dimensions: WorldPoint,
    g_empty: Glyph,
    public level: number,
  ) {
    this.cells = this.allocateMap(g_empty);
  }

  /**
   * Retrieves the map cell at the specified world point.
   * @param {WorldPoint} p - The world point to retrieve the cell for.
   * @returns {MapCell} The map cell at the specified world point.
   */
  getCell(p: WorldPoint): MapCell {
    return this.cells[p.y][p.x];
  }

  /**
   * Checks if the specified world point is legal on the game map.
   * @param {WorldPoint} p - The world point to check.
   * @returns {boolean} True if the point is legal, false otherwise.
   */
  isLegalPoint(p: WorldPoint): boolean {
    return (
      p.x >= 0 && p.y >= 0 && p.x < this.dimensions.x && p.y < this.dimensions.y
    );
  }

  /**
   * Allocates and initializes the game map with empty cells.
   * @param {Glyph} g_empty - The default glyph for empty cells.
   * @returns {MapCell[][]} The 2D array of initialized map cells.
   */
  allocateMap(g_empty: Glyph): MapCell[][] {
    const cells = new Array(this.dimensions.y);
    const p: WorldPoint = new WorldPoint();
    for (p.y = 0; p.y < this.dimensions.y; ++p.y) {
      cells[p.y] = new Array(this.dimensions.x);
      for (p.x = 0; p.x < this.dimensions.x; ++p.x) {
        cells[p.y][p.x] = new MapCell(g_empty);
      }
    }
    return cells;
  }
}
