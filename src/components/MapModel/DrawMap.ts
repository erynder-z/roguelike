import { GameIF } from '../../interfaces/Builder/Game';
import { Map } from '../../interfaces/Map/Map';
import { DrawableTerminal } from '../../interfaces/Terminal/DrawableTerminal';
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
   * Draws a map on a drawable terminal.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {Map} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   */
  static drawMap(term: DrawableTerminal, map: Map, vp: WorldPoint) {
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    // Loop through each row and column of the terminal
    for (t.y = 0, w.y = vp.y; t.y < terminalDimensions.y; ++t.y, ++w.y) {
      for (t.x = 0, w.x = vp.x; t.x < terminalDimensions.x; ++t.x, ++w.x) {
        // Get the cell from the map corresponding to the world point
        const cell: MapCell = map.isLegalPoint(w) ? map.cell(w) : this.outside;
        // Get the glyph info for the cell's glyph
        const i: GlyphInfo = GlyphMap.getGlyphInfo(cell.glyph());
        // Draw the glyph on the terminal
        term.drawAt(t.x, t.y, i.char, 'gray', 'light-gray');
      }
    }
  }
  /**
   * Represents the map cell used for points outside the map boundaries.
   * @type {MapCell}
   */
  static outside: MapCell = new MapCell(Glyph.Unknown);

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
    player_pos: WorldPoint,
    g: GameIF,
  ) {
    if (!player_pos) {
      player_pos = new WorldPoint();
    }

    const viewport: WorldPoint = new WorldPoint(
      -Math.floor(term.dimensions.x * 0.5) + player_pos.x,
      -Math.floor(term.dimensions.y * 0.5) + player_pos.y,
    );
    this.drawMap(term, map, viewport);
  }
}
