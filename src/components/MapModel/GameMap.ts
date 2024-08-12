import { Corpse } from '../Mobs/Corpse';
import { EnvironmentChecker } from '../Environment/EnvironmentChecker';
import { FindFreeSpace } from '../Utilities/FindFreeSpace';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { ItemObject } from '../ItemObjects/ItemObject';
import { MapCell } from './MapCell';
import { Map } from './Types/Map';
import { Mob } from '../Mobs/Mob';
import { ItemObjectManager } from '../ItemObjects/ItemObjectManager';
import { Spell } from '../Spells/Spell';
import { TurnQueue } from '../TurnQueue/TurnQueue';
import { WorldPoint } from './WorldPoint';

/**
 * Represents the current game map.
 */
export class GameMap implements Map {
  constructor(
    public dimensions: WorldPoint,
    public g_empty: Glyph,
    public level: number,
    public isDark: boolean = false,
    public cells: MapCell[][] = [],
    public upStairPos?: WorldPoint,
    public downStairPos?: WorldPoint,
    public queue: TurnQueue = new TurnQueue(),
  ) {
    this.cells = this.allocateMap(g_empty);
  }

  /**
   * Retrieves the map cell at the specified world point.
   * @param {WorldPoint} p - The world point to retrieve the cell for.
   * @returns {MapCell} The map cell at the specified world point.
   */
  public cell(p: WorldPoint): MapCell {
    return this.cells[p.y][p.x];
  }

  /**
   * Checks if the specified world point is legal on the game map.
   * @param {WorldPoint} p - The world point to check.
   * @returns {boolean} True if the point is legal, false otherwise.
   */
  public isLegalPoint(p: WorldPoint): boolean {
    return (
      p.x >= 0 && p.y >= 0 && p.x < this.dimensions.x && p.y < this.dimensions.y
    );
  }

  /**
   * Allocates and initializes the game map with empty cells.
   * @param {Glyph} g_empty - The default glyph for empty cells.
   * @returns {MapCell[][]} The 2D array of initialized map cells.
   */
  private allocateMap(g_empty: Glyph): MapCell[][] {
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
   * Adds information about the location of up and down stairs.
   *
   * @param {Glyph.StairsUp | Glyph.StairsDown} glyph - The type of stair glyph (up or down).
   * @param {WorldPoint} pos - The position of the stair on the map.
   * @returns {void}
   */
  public addStairInfo(
    glyph: Glyph.StairsUp | Glyph.StairsDown,
    pos: WorldPoint,
  ): void {
    if (glyph === Glyph.StairsUp) this.upStairPos = pos;
    if (glyph === Glyph.StairsDown) this.downStairPos = pos;
  }

  /**
   * Moves the given mob to the specified world point.
   *
   * @param {Mob} m - the mob to be moved
   * @param {WorldPoint} p - the destination world point
   * @return {void}
   */
  public moveMob(m: Mob, p: WorldPoint): void {
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
  public addNPC(m: Mob): Mob {
    m.description = GlyphMap.getGlyphDescription(m.glyph, 'mob');
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
  public removeMob(m: Mob): void {
    this.queue.removeMob(m);
    this.cell(m.pos).mob = undefined;
  }

  /**
   * Transforms a mob into a corpse and updates the game state accordingly.
   *
   * @param {Mob} mob - the mob to be transformed into a corpse
   * @return {void}
   */
  public mobToCorpse(mob: Mob): void {
    this.queue.removeMob(mob);

    const corpseGlyph =
      Glyph[`${Glyph[mob.glyph]}_Corpse` as keyof typeof Glyph];

    const cell = this.cell(mob.pos);
    const canDrop = EnvironmentChecker.canCorpseBeDropped(cell);

    if (!canDrop) {
      const maxDropRadius = 5;
      const np = FindFreeSpace.findFreeAdjacent(mob.pos, this, maxDropRadius);
      if (np) {
        const corpse = new Corpse(corpseGlyph, np.x, np.y).create();
        const cell = this.cell(np);

        cell.mob = undefined;
        cell.corpse = corpse;
      }
    }

    const corpse = new Corpse(corpseGlyph, mob.pos.x, mob.pos.y).create();

    cell.mob = undefined;
    cell.corpse = corpse;
  }

  /**
   * Enters the player into the map at the specified world point.
   *
   * @param {Mob} player - the player to enter into the map
   * @param {WorldPoint} np - the world point where the player will enter
   * @return {void}
   */
  public enterMap(player: Mob, np: WorldPoint): void {
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
  public isBlocked(p: WorldPoint): boolean {
    if (!this.isLegalPoint(p)) {
      return true;
    }
    const c = this.cell(p);
    return c.isBlocked();
  }

  /**
   * Adds a new object to the game at the specified world point.
   *
   * @param {ItemObject} o - the object to be added
   * @param {WorldPoint} np - the world point where the player will enter
   * @return {void}
   */
  public addObject(o: ItemObject, p: WorldPoint): void {
    o.desc = GlyphMap.getGlyphDescription(o.glyph, 'object');
    if (o.spell != Spell.None)
      o.desc = ItemObjectManager.getSpellDescription(o.spell);

    this.cell(p).obj = o;
  }

  /**
   * Loops over every cell in the game map and performs the given action.
   * @param {Function} action - The action to perform on each cell.
   */
  public forEachCell(action: (cell: MapCell, p: WorldPoint) => void): void {
    const p: WorldPoint = new WorldPoint();
    for (p.y = 0; p.y < this.dimensions.y; ++p.y) {
      for (p.x = 0; p.x < this.dimensions.x; ++p.x) {
        action(this.cell(p), new WorldPoint(p.x, p.y));
      }
    }
  }

  /**
   * Sets the environment description for every cell.
   */
  public setEnvironmentDescriptions(): void {
    this.forEachCell(cell => {
      const glyph = cell.glyphEnvOnly();
      cell.envDesc = GlyphMap.getGlyphDescription(glyph, 'environment');
    });
  }
}
