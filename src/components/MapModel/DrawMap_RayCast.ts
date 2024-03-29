import { GameIF } from '../Builder/Interfaces/Game';
import { Map } from './Interfaces/Map';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { CanSee } from '../Utilities/CanSee';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphInfo } from '../Glyphs/GlyphInfo';
import { GlyphMap } from '../Glyphs/GlyphMap';
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
        term.drawAt(t.x, t.y, i.char, i.fgCol, i.bgCol);
      }
    }
  }
  /**
   * Represents the map cell used for points outside the map boundaries.
   * @type {MapCell}
   */
  static outside: MapCell = new MapCell(Glyph.Unknown);

  /**
   * Draws a map with considerations for player position and lighting conditions.
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
    const unlitColor: string = '#001';
    const unlitColorSolidBg: string = '#222';
    const farLitColor: string = '#778899';
    const farDist: number = 50;

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

        // Check if the cell is visible to the player using raycasting LOS
        const isVisible: boolean = this.raycastLOS(playerPos, w, map);

        const g: Glyph = isVisible
          ? cell.mob
            ? cell.mob.glyph
            : cell.glyphObjOrEnv()
          : Glyph.Unknown;
        const index = GlyphMap.getGlyphInfo(g);
        const glyphInfo = GlyphMap.getGlyphInfo(g);

        let fg: string;
        let bg: string;

        if (far) {
          bg = index.hasSolidBg && cell.lit ? unlitColorSolidBg : unlitColor;
          fg = cell.lit
            ? cell.env === Glyph.Unknown
              ? glyphInfo.bgCol // use the background color to prevent the whole outside map from popping in when coming near it
              : farLitColor
            : unlitColor;
        } else {
          bg = index.bgCol;
          fg = index.fgCol;
          if (!cell.lit) cell.lit = true;
        }

        term.drawAt(t.x, t.y, index.char, fg, bg);
      }
    }
  }

  /**
   * Performs raycasting to determine line of sight between two points on the map.
   * @param {WorldPoint} start - The starting point of the LOS check.
   * @param {WorldPoint} end - The ending point of the LOS check.
   * @param {Map} map - The map object.
   * @returns {boolean} - True if there is line of sight, otherwise false.
   */
  static raycastLOS(start: WorldPoint, end: WorldPoint, map: Map): boolean {
    // Get the differences in coordinates between the start and end points
    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    // Determine the direction of movement for the ray (1 or -1)
    const sx = start.x < end.x ? 1 : -1;
    const sy = start.y < end.y ? 1 : -1;

    // Error accumulator for adjusting the y coordinate when moving in the x direction
    let err = dx - dy;

    // Current position of the ray
    let x = start.x;
    let y = start.y;

    // Perform raycasting
    while (x !== end.x || y !== end.y) {
      // Check if the current position is inside the map bounds
      if (!map.isLegalPoint(new WorldPoint(x, y))) {
        return false; // Hit map boundary, LOS blocked
      }

      // Check if the current cell blocks LOS
      const cell = map.cell(new WorldPoint(x, y));
      if (cell.isOpaque()) {
        return false; // Cell blocks LOS
      }

      // Adjust the position of the ray based on the error accumulator
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }

    // No obstacles encountered, LOS is clear
    return true;
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

    const stats = document.getElementById('stats-container');
    if (stats) stats.innerText = statsDisplay;
  }

  //Renders directly on the canvas
  /*  static renderMessage(term: DrawableTerminal, game: GameIF): void {
    const log = game.log;

     if (!log) return;
    const line = log.top();
    const num = log.len();
    let s = num > 1 ? `${line} (${num} more)` : line; 

     s = this.extend(s, term);
    const x = 0;
    const y = 1;
    term.drawText(x, y, s, 'cyan', 'blue'); 
  } */

  static renderMessage(term: DrawableTerminal, game: GameIF): void {
    const log = game.log;

    const messageLog = log.archive.slice(-30);

    const ulElement = document.createElement('ul');

    messageLog.forEach(message => {
      const liElement = document.createElement('li');
      liElement.textContent = message;
      ulElement.appendChild(liElement);
    });

    const messagesContainer = document.getElementById('messages-container');
    while (messagesContainer?.firstChild) {
      messagesContainer.removeChild(messagesContainer.firstChild);
    }

    messagesContainer?.appendChild(ulElement);
  }

  static renderFlash(term: DrawableTerminal, game: GameIF): void {
    const log = game.log;

    if (!log) return;

    let s = log.top();
    s = this.extend(s, term);

    const x = 0;
    const y = 0;
    term.drawText(x, y, s, 'yellow', '#00000000');
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
