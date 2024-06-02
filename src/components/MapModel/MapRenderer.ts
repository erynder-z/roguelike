import { Buff } from '../Buffs/BuffEnum';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphInfo } from '../Glyphs/GlyphInfo';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { Spell } from '../Spells/Spell';
import { SpellColors } from '../Spells/SpellColors';
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
  private static unlitColor: string = '#111a24';
  private static unlitColorSolidBg: string = '#222';
  private static farLitColor: string = '#778899';

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
    // Constants
    const farDist = g.stats.visRange || 50;
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
          CanSee.checkPointLOS_Bresenham(cell.mob.pos, playerPos, map, true);

        // Determine the glyph based on visibility
        const glyph: Glyph = isEntityVisible
          ? cell.mob!.glyph
          : cell.glyphSpriteOrObjOrEnv();
        const glyphInfo = GlyphMap.getGlyphInfo(glyph);
        const envOnlyGlyphInfo = GlyphMap.getGlyphInfo(cell.env);

        // Determine foreground and background colors
        let fg: string;
        let bg: string;

        if (far) {
          bg = this.getFarBgCol(cell, glyphInfo);
          fg = this.getFarFgCol(cell, glyphInfo);
        } else {
          if (blind) {
            bg = this.getBlindBgCol(cell, glyphInfo);
            fg = this.getBlindFgCol(cell, glyphInfo);
          } else {
            // fg color based on mob/item and bg color based on env
            bg = envOnlyGlyphInfo.bgCol;
            fg = glyphInfo.fgCol;
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
          CanSee.checkPointLOS_Bresenham(cell.mob.pos, playerPos, map, true);

        // Determine the glyph based on visibility
        const glyph: Glyph = isEntityVisible
          ? cell.mob!.glyph
          : cell.glyphSpriteOrObjOrEnv();
        const glyphInfo = GlyphMap.getGlyphInfo(glyph);

        // Determine foreground and background colors
        let fg: string;
        let bg: string;

        if (far) {
          bg = this.getFarBgCol(cell, glyphInfo);

          fg = this.getFarFgCol(cell, glyphInfo);
        } else {
          if (blind) {
            bg = this.getBlindBgCol(cell, glyphInfo);
            fg = this.getBlindFgCol(cell, glyphInfo);
          } else {
            if (!cell.lit && !blind) cell.lit = true;
            // Check if the cell is visible to the player using raycasting LOS
            const isVisible: boolean = CanSee.checkPointLOS_RayCast(
              playerPos,
              w,
              map,
            );
            bg = this.getRayCastBgCol(isVisible, cell, glyphInfo);
            fg = this.getRayCastFgCol(isVisible, cell, glyphInfo);
          }
        }

        term.drawAt(t.x, t.y, glyphInfo.char, fg, bg);
      }
    }
  }

  /**
   * Calculates the background color for a cell based on its properties.
   *
   * @param {MapCell} cell - The cell for which to determine the background color.
   * @param {GlyphInfo} glyphInfo - Information about the glyph for the cell.
   * @return {string} The calculated background color for the cell.
   */
  private static getFarBgCol(cell: MapCell, glyphInfo: GlyphInfo): string {
    return glyphInfo.hasSolidBg && cell.lit
      ? this.unlitColorSolidBg
      : this.unlitColor;
  }

  /**
   * Calculates the foreground color for a cell that is far from the player, based on its properties.
   *
   * @param {MapCell} cell - The cell for which to determine the foreground color.
   * @param {GlyphInfo} glyphInfo - Information about the glyph for the cell.
   * @return {string} The calculated foreground color for the cell.
   */
  private static getFarFgCol(cell: MapCell, glyphInfo: GlyphInfo): string {
    return cell.lit
      ? cell.env === Glyph.Unknown
        ? glyphInfo.bgCol
        : this.farLitColor
      : this.unlitColor;
  }

  /**
   * Calculates the background color for a cell when the player is blind, based on its properties.
   *
   * @param {MapCell} cell - The cell for which to determine the background color.
   * @param {GlyphInfo} glyphInfo - Information about the glyph for the cell.
   * @return {string} The calculated background color for the cell.
   */
  private static getBlindBgCol(cell: MapCell, glyphInfo: GlyphInfo): string {
    return glyphInfo.hasSolidBg && cell.lit
      ? this.unlitColorSolidBg
      : this.unlitColor;
  }

  /**
   * Returns the foreground color for a cell when the player is blind.
   *
   * @param {MapCell} cell - The cell for which to determine the foreground color.
   * @param {GlyphInfo} glyphInfo - Information about the glyph.
   * @return {string} The foreground color for the cell.
   */
  private static getBlindFgCol(cell: MapCell, glyphInfo: GlyphInfo): string {
    return cell.lit || cell.mob?.isPlayer
      ? cell.env === Glyph.Unknown
        ? glyphInfo.bgCol
        : this.farLitColor
      : this.unlitColor;
  }

  /**
   * Calculates the background color for a cell based on its properties.
   *
   * @param {boolean} isVisible - Indicates if the cell is visible.
   * @param {MapCell} cell - The cell for which to determine the background color.
   * @param {GlyphInfo} glyphInfo - Information about the glyph for the cell.
   * @return {string} The calculated background color for the cell.
   */
  private static getRayCastBgCol(
    isVisible: boolean,
    cell: MapCell,
    glyphInfo: GlyphInfo,
  ): string {
    let bg: string;
    const envOnlyGlyphInfo = GlyphMap.getGlyphInfo(cell.env);

    if (isVisible) {
      bg = envOnlyGlyphInfo.bgCol;
    } else {
      bg =
        glyphInfo.hasSolidBg && cell.lit
          ? this.unlitColorSolidBg
          : this.unlitColor;
    }

    return bg;
  }

  /**
   * Calculates the foreground color for a cell based on its properties during ray casting.
   *
   * @param {boolean} isVisible - Indicates if the cell is visible.
   * @param {MapCell} cell - The cell for which to determine the foreground color.
   * @param {GlyphInfo} glyphInfo - Information about the glyph for the cell.
   * @return {string} The calculated foreground color for the cell.
   */
  private static getRayCastFgCol(
    isVisible: boolean,
    cell: MapCell,
    glyphInfo: GlyphInfo,
  ): string {
    let fg: string;

    if (isVisible) {
      fg = glyphInfo.fgCol;
      if (cell.obj && cell.obj.spell != Spell.None)
        fg = SpellColors.c[cell.obj.spell][0];
    } else {
      if (cell.lit || cell.mob?.isPlayer) {
        fg = cell.env === Glyph.Unknown ? glyphInfo.bgCol : this.farLitColor;
      } else {
        fg = this.unlitColor;
      }
    }

    return fg;
  }
}
