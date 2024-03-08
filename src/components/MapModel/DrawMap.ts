import { GameIF } from '../../interfaces/Builder/Game';
import { Map } from '../../interfaces/Map/Map';
import { DrawableTerminal } from '../../interfaces/Terminal/DrawableTerminal';
import { CanSee } from '../Commands/CanSee';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { Glyph } from './Glyph';
import { GlyphInfo } from './GlyphInfo';
import { GlyphMap } from './GlyphMap';
import { MapCell } from './MapCell';
import { WorldPoint } from './WorldPoint';

/**
 * Represents a utility class for drawing a map on a drawable terminal.
 */
export class DrawMap {
  /**
   * Draws a map on a drawable terminal. The whole map is visible.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {Map} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   */
  static drawMap0(term: DrawableTerminal, map: Map, vp: WorldPoint) {
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;

    // Loop through each row and column of the terminal
    for (
      t.y = mapOffSet, w.y = vp.y;
      t.y < terminalDimensions.y + mapOffSet;
      ++t.y, ++w.y
    ) {
      // Loop through each column of the terminal
      for (t.x = 0, w.x = vp.x; t.x < terminalDimensions.x; ++t.x, ++w.x) {
        // Get the cell from the map corresponding to the world point
        const cell: MapCell = map.isLegalPoint(w) ? map.cell(w) : this.outside;
        // Get the glyph info for the cell's glyph
        const i: GlyphInfo = GlyphMap.getGlyphInfo(cell.glyph());
        // Draw the glyph on the terminal
        term.drawAt(t.x, t.y, i.char, i.bgCol, i.fgCol);
      }
    }
  }
  /**
   * Represents the map cell used for points outside the map boundaries.
   * @type {MapCell}
   */
  static outside: MapCell = new MapCell(Glyph.Unknown);

  /**
   * Draws a map with considerations for player position and if the player can see a cell or not.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {Map} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {GameIF} g - The game interface.
   */
  static drawMap1(
    term: DrawableTerminal,
    map: Map,
    vp: WorldPoint,
    playerPos: WorldPoint,
    g: GameIF,
  ) {
    const unlit: string = '#001';
    const farLit: string = '#124';
    const farDist: number = 50;

    let fg: string;
    let bg: string;

    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;

    // Loop through each row and column of the terminal
    for (
      t.y = mapOffSet, w.y = vp.y;
      t.y < terminalDimensions.y + mapOffSet;
      ++t.y, ++w.y
    ) {
      // Loop through each column of the terminal
      for (t.x = 0, w.x = vp.x; t.x < terminalDimensions.x; ++t.x, ++w.x) {
        // Get the cell from the map corresponding to the world point
        const cell: MapCell = map.isLegalPoint(w) ? map.cell(w) : this.outside;
        const distance: number = w.squaredDistanceTo(playerPos);
        const far: boolean = distance > farDist;

        const seeMob =
          !!cell.mob &&
          !far &&
          CanSee.canSee(cell.mob.pos, playerPos, map, true);

        const g: Glyph = seeMob ? cell.mob!.glyph : cell.glyphEnvOnly();

        const index = GlyphMap.getGlyphInfo(g);

        if (far) {
          bg = unlit;
          fg = cell.lit ? farLit : unlit;
        } else {
          bg = index.bgCol;
          fg = index.fgCol;
          if (!cell.lit) cell.lit = true;
        }
        term.drawAt(t.x, t.y, index.char, bg, fg);
      }
    }
  }
  /**
   * Draw the player on the map.
   *
   * @param {DrawableTerminal} term - the terminal to draw on
   * @param {Map} map - the map to draw
   * @param {WorldPoint} player_pos - the position of the player
   * @param {GameIF} g - the game interface
   */
  static drawMapPlayer(
    term: DrawableTerminal,
    map: Map,
    playerPos: WorldPoint,
    g: GameIF,
  ) {
    if (!playerPos) playerPos = new WorldPoint();

    const viewport: WorldPoint = new WorldPoint(
      -Math.floor(term.dimensions.x * 0.5) + playerPos.x,
      -Math.floor(term.dimensions.y * 0.5) + playerPos.y,
    );
    this.drawMap1(term, map, viewport, playerPos, g);
    /* this.drawMap0(term, map, viewport); */
  }

  /**
   * Renders the player stats on the terminal.
   *
   * @param {DrawableTerminal} term - the terminal to render the stats on
   * @param {GameIF} game - the game instance to retrieve player stats from
   * @return {void}
   */
  static renderStats(term: DrawableTerminal, game: GameIF): void {
    const player = game.player;
    const hp = player.hp;
    const maxhp = player.maxhp;
    const lvl = game.dungeon.level;

    const hpDisplayText = `HP: ${hp}/${maxhp}`;
    const lvlDisplayText = `LVL: ${lvl}`;

    const statsDisplay = this.extend(
      hpDisplayText + ' ' + lvlDisplayText,
      term,
    );

    /*
    // Display stats directly on the canvas
    const x = 0;
    const y = 0;
   term.drawText(x, y, statsDisplay, 'yellow', 'teal'); */

    // Display stats in a separate HTML element
    const stats = document.getElementById('stats-container');
    if (stats) stats.innerText = statsDisplay;
  }

  /**
   * Renders the top message on the terminal.
   * @param {DrawableTerminal} term - The terminal to render the message on.
   * @param {GameIF} game - The game instance to retrieve the message from.
   * @returns {void}
   */
  static renderMessage(term: DrawableTerminal, game: GameIF): void {
    const log = game.log;

    if (!log) return;
    const line = log.top();
    const num = log.len();
    const s = num > 1 ? `${line} (${num} more)` : line;

    /* 
    // Display messages directly on the canvas
     s = this.extend(s, term);
    const x = 0;
    const y = 1;
    term.drawText(x, y, s, 'cyan', 'blue'); */

    // Display messages in a separate HTML element
    const messages = document.getElementById('messages-container');
    if (messages) messages.innerText = s;
  }
  /**
   * Use an empty string as the mask.
   * @type {string}
   */
  static mask: string = '';

  /**
   * Extends the given string to fit the terminal width.
   * @param {string} s - The string to extend.
   * @param {DrawableTerminal} term - The terminal.
   * @returns {string} - The extended string.
   */
  static extend(s: string, term: DrawableTerminal): string {
    const dimensions = term.dimensions;

    if (!this.mask) this.mask = ' '.repeat(dimensions.x);

    return s + this.mask.substring(0, dimensions.x - s.length);
  }
}
