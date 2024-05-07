import { Buff } from '../Buffs/BuffEnum';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { CanSee } from '../Utilities/CanSee';
import { MapIF } from './Interfaces/MapIF';
import { MapCell } from './MapCell';
import { WorldPoint } from './WorldPoint';

export class MapRenderer {
  /**
   * Represents the map cell used for points outside the map boundaries.
   * @type {MapCell}
   */
  static outside: MapCell = new MapCell(Glyph.Unknown);

  /**
   * Draws a map with considerations for player position and lighting conditions.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {MapIF} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {GameIF} g - The game interface.
   */
  static drawMap_Normal(
    term: DrawableTerminal,
    map: MapIF,
    vp: WorldPoint,
    playerPos: WorldPoint,
    g: GameIF,
  ) {
    // Colors
    const unlitColor: string = '#001';
    const unlitColorSolidBg: string = '#222';
    const farLitColor: string = '#778899';

    // Constants
    const farDist: number = 50;
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;
    const buffs = g.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);

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
        const far: boolean = distance > farDist && !blind;

        // Check if the cell contains a visible entity
        const isEntityVisible: boolean =
          !!cell.mob &&
          !far &&
          (!blind || cell.mob.isPlayer) &&
          CanSee.canSee(cell.mob.pos, playerPos, map, true);

        // Determine the glyph based on visibility
        const glyph: Glyph = isEntityVisible
          ? cell.mob!.glyph
          : cell.glyphSpriteOrObjOrEnv();
        const glyphInfo = GlyphMap.getGlyphInfo(glyph);

        // Determine foreground and background colors
        let fg: string;
        let bg: string;

        if (far) {
          bg =
            glyphInfo.hasSolidBg && cell.lit ? unlitColorSolidBg : unlitColor;
          fg = cell.lit
            ? cell.env === Glyph.Unknown
              ? glyphInfo.bgCol // use the background color to prevent the whole outside map from popping in when coming near it
              : farLitColor
            : unlitColor;
        } else {
          if (!blind) {
            bg = glyphInfo.bgCol;
            fg = glyphInfo.fgCol;
          } else {
            bg =
              glyphInfo.hasSolidBg && cell.lit ? unlitColorSolidBg : unlitColor;
            fg =
              cell.lit || cell.mob?.isPlayer
                ? cell.env === Glyph.Unknown
                  ? glyphInfo.bgCol
                  : farLitColor
                : unlitColor;
          }

          if (!cell.lit && !blind) cell.lit = true;
        }

        term.drawAt(t.x, t.y, glyphInfo.char, fg, bg);
      }
    }
  }

  /**
   * Draws a map with considerations for player position and lighting conditions. Uses ray casting to determine visibility.
   * @param {DrawableTerminal} term - The drawable terminal to draw on.
   * @param {MapIF} map - The map to draw.
   * @param {WorldPoint} vp - The viewport representing the point in the world where drawing starts.
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {GameIF} g - The game interface.
   */
  static drawMap_RayCast(
    term: DrawableTerminal,
    map: MapIF,
    vp: WorldPoint,
    playerPos: WorldPoint,
    g: GameIF,
  ) {
    // Colors
    const unlitColor: string = '#001';
    const unlitColorSolidBg: string = '#222';
    const farLitColor: string = '#778899';

    // Constants
    const farDist: number = 50;
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;
    const buffs = g.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);

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
        const far: boolean = distance > farDist && !blind;

        // Check if the cell contains a visible entity
        const isEntityVisible: boolean =
          !!cell.mob &&
          !far &&
          (!blind || cell.mob.isPlayer) &&
          CanSee.canSee(cell.mob.pos, playerPos, map, true);

        // Determine the glyph based on visibility
        const glyph: Glyph = isEntityVisible
          ? cell.mob!.glyph
          : cell.glyphSpriteOrObjOrEnv();
        const glyphInfo = GlyphMap.getGlyphInfo(glyph);

        // Determine foreground and background colors
        let fg: string;
        let bg: string;

        if (far) {
          bg =
            glyphInfo.hasSolidBg && cell.lit ? unlitColorSolidBg : unlitColor;
          fg = cell.lit
            ? cell.env === Glyph.Unknown
              ? glyphInfo.bgCol // use the background color to prevent the whole outside map from popping in when coming near it
              : farLitColor
            : unlitColor;
        } else {
          if (!blind) {
            if (!cell.lit && !blind) cell.lit = true;
            // Check if the cell is visible to the player using raycasting LOS
            const isVisible: boolean = this.rayCastLOS(playerPos, w, map);
            bg = isVisible
              ? glyphInfo.bgCol
              : glyphInfo.hasSolidBg && cell.lit
                ? unlitColorSolidBg
                : unlitColor;
            fg = isVisible
              ? glyphInfo.fgCol
              : cell.lit || cell.mob?.isPlayer
                ? cell.env === Glyph.Unknown
                  ? glyphInfo.bgCol
                  : farLitColor
                : unlitColor;
          } else {
            bg =
              glyphInfo.hasSolidBg && cell.lit ? unlitColorSolidBg : unlitColor;
            fg =
              cell.lit || cell.mob?.isPlayer
                ? cell.env === Glyph.Unknown
                  ? glyphInfo.bgCol
                  : farLitColor
                : unlitColor;
          }
        }

        term.drawAt(t.x, t.y, glyphInfo.char, fg, bg);
      }
    }
  }

  /**
   * Performs raycasting to determine line of sight between two points on the map.
   * @param {WorldPoint} start - The starting point of the LOS check.
   * @param {WorldPoint} end - The ending point of the LOS check.
   * @param {MapIF} map - The map object.
   * @returns {boolean} - True if there is line of sight, otherwise false.
   */
  static rayCastLOS(start: WorldPoint, end: WorldPoint, map: MapIF): boolean {
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
}
