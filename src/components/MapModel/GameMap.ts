import { Map } from '../../interfaces/Map/Map';
import { Mob } from '../Mobs/Mob';
import { TurnQueue } from '../TurnQueue/TurnQueue';
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
  queue: TurnQueue = new TurnQueue();
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
  cell(p: WorldPoint): MapCell {
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

  /**
   * Moves the given mob to the specified world point.
   *
   * @param {Mob} m - the mob to be moved
   * @param {WorldPoint} p - the destination world point
   * @return {void} 
   */
  moveMob(m: Mob, p: WorldPoint): void {
    this.cell(m.pos).mob = undefined;
    m.pos.x = p.x;
    m.pos.y = p.y;
    this.cell(m.pos).mob = m;
  }

  /**
   * Adds a new NPC to the game.
   *
   * @param {Mob} m - the NPC to be added
   * @return {Mob} the added NPC
   */
  addNPC(m: Mob): Mob {
    this.cell(m.pos).mob = m;
    this.queue.pushMob(m);
    return m;
  }

  /**
   * Remove a mob from the queue and set its position to undefined.
   *
   * @param {Mob} m - The mob to be removed.
   * @return {void} 
   */
  removeMob(m: Mob): void {
    this.queue.removeMob(m);
    this.cell(m.pos).mob = undefined;
  }

  /**
   * Enters the player into the map at the specified world point.
   *
   * @param {Mob} player - the player to enter into the map
   * @param {WorldPoint} np - the world point where the player will enter
   * @return {void} 
   */
  enterMap(player: Mob, np: WorldPoint): void {
    player.pos.set(np);
    this.cell(player.pos).mob = player;
    this.queue.pushMob(player);
  }

  /**
   * A function that checks if a given WorldPoint is blocked.
   *
   * @param {WorldPoint} p - the WorldPoint to check
   * @return {boolean} true if the WorldPoint is blocked, false otherwise
   */
  isBlocked(p: WorldPoint): boolean {
    if (!this.isLegalPoint(p)) {
      return true;
    }
    const c = this.cell(p);
    return c.isBlocked();
  }
}
