import { Buff } from '../Buffs/BuffEnum';
import { CanSee } from '../Utilities/CanSee';
import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphInfo } from '../Glyphs/GlyphInfo';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { MapCell } from './MapCell';
import { Map } from './Types/Map';
import { Spell } from '../Spells/Spell';
import { SpellColors } from '../Spells/SpellColors';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { WorldPoint } from './WorldPoint';

/**
 * Sets each cell in the terminal to the appropriate glyph, information and colors.
 */
export class MapRenderer {
  public static outside: MapCell = new MapCell(Glyph.Unknown);
  private static unlitColor: string = '#111a24';
  private static unlitColorSolidBg: string = '#222';
  private static farLitColor: string = '#485460';

  /**
   * Calculates the far distance from the player based on the presence of glowing rocks. The far distance can not be nigher than the default visibility range.
   *
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {Map} map - The game map.
   * @param {GameState} g - The game state.
   * @return {number} The calculated far distance.
   */
  private static getFarDist(
    playerPos: WorldPoint,
    map: Map,
    g: GameState,
  ): number {
    const glowRange = 8;
    let farDist = g.stats.currentVisRange || 50;

    if (this.checkForGlowingRocks(playerPos, map, glowRange)) {
      if (farDist * 3 < g.stats.defaultVisRange) {
        farDist *= 3;
      } else {
        farDist = g.stats.defaultVisRange;
      }
    }

    return farDist;
  }

  /**
   * Draws a cell on the terminal based on various conditions such as visibility, distance, and lighting.
   *
   * @param {DrawableTerminal} term - The terminal to draw on
   * @param {TerminalPoint} t - The terminal point to draw at
   * @param {WorldPoint} w - The world point of the cell
   * @param {Map} map - The game map
   * @param {WorldPoint} playerPos - The position of the player
   * @param {number} farDist - The calculated far distance
   * @param {boolean} blind - Indicates if the player is blind
   * @param {boolean} isRayCast - Indicates if the drawing is based on ray casting
   */
  private static drawCell(
    term: DrawableTerminal,
    t: TerminalPoint,
    w: WorldPoint,
    map: Map,
    playerPos: WorldPoint,
    farDist: number,
    blind: boolean,
    isRayCast: boolean,
  ) {
    const cell: MapCell = map.isLegalPoint(w) ? map.cell(w) : this.outside;
    const distance: number = w.squaredDistanceTo(playerPos);
    const far: boolean = distance > farDist && !blind;

    const isEntityVisible: boolean =
      !!cell.mob &&
      !far &&
      (!blind || cell.mob.isPlayer) &&
      CanSee.checkPointLOS_Bresenham(cell.mob.pos, playerPos, map, true);

    const glyph: Glyph = isEntityVisible
      ? cell.mob!.glyph
      : cell.glyphSpriteOrObjOrEnv();
    const glyphInfo = GlyphMap.getGlyphInfo(glyph);
    const envOnlyGlyphInfo = GlyphMap.getGlyphInfo(cell.env);

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
        if (isRayCast) {
          const isVisible: boolean = CanSee.checkPointLOS_RayCast(
            playerPos,
            w,
            map,
          );
          bg = this.getRayCastBgCol(isVisible, cell, glyphInfo);
          fg = this.getRayCastFgCol(isVisible, cell, glyphInfo);
        } else {
          bg = envOnlyGlyphInfo.bgCol;
          fg = glyphInfo.fgCol;
          if (!cell.mob && cell.obj && cell.obj.spell != Spell.None)
            fg = SpellColors.c[cell.obj.spell][0];
        }
      }
    }

    term.drawAt(t.x, t.y, glyphInfo.char, fg, bg);
  }

  /**
   * Checks if there are any glowing rocks within a certain distance of the player.
   *
   * @param {WorldPoint} playerPos - The position of the player.
   * @param {Map} map - The map to search for glowing rocks.
   * @param {number} diameter - The maximum distance to search for glowing rocks.
   * @return {boolean} Returns true if there are glowing rocks within the specified distance, otherwise false.
   */
  private static checkForGlowingRocks(
    playerPos: WorldPoint,
    map: Map,
    diameter: number,
  ): boolean {
    const neighbors: WorldPoint[] = [];
    for (const neighbor of playerPos.getNeighbors(diameter * 0.5)) {
      neighbors.push(neighbor);
    }

    for (const neighbor of neighbors) {
      if (map.isLegalPoint(neighbor) && map.cell(neighbor).isGlowing()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Draws the normal map on the terminal based on the player's position and game state.
   *
   * @param {DrawableTerminal} term - The terminal to draw on
   * @param {Map} map - The game map
   * @param {WorldPoint} vp - The view point
   * @param {WorldPoint} playerPos - The position of the player
   * @param {GameState} g - The game state
   */
  public static drawMap_Normal(
    term: DrawableTerminal,
    map: Map,
    vp: WorldPoint,
    playerPos: WorldPoint,
    g: GameState,
  ) {
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;
    const buffs = g.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);

    const farDist = this.getFarDist(playerPos, map, g);

    for (
      t.y = mapOffSet, w.y = vp.y;
      t.y < terminalDimensions.y + mapOffSet;
      ++t.y, ++w.y
    ) {
      for (t.x = 0, w.x = vp.x; t.x < terminalDimensions.x; ++t.x, ++w.x) {
        this.drawCell(term, t, w, map, playerPos, farDist, blind, false);
      }
    }
  }

  /**
   * Draws the map using ray casting technique on the terminal based on the player's position and game state.
   *
   * @param {DrawableTerminal} term - The terminal to draw on
   * @param {Map} map - The game map
   * @param {WorldPoint} vp - The view point
   * @param {WorldPoint} playerPos - The position of the player
   * @param {GameState} g - The game state
   */
  public static drawMap_RayCast(
    term: DrawableTerminal,
    map: Map,
    vp: WorldPoint,
    playerPos: WorldPoint,
    g: GameState,
  ) {
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;
    const buffs = g.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);

    const farDist = this.getFarDist(playerPos, map, g);

    for (
      t.y = mapOffSet, w.y = vp.y;
      t.y < terminalDimensions.y + mapOffSet;
      ++t.y, ++w.y
    ) {
      for (t.x = 0, w.x = vp.x; t.x < terminalDimensions.x; ++t.x, ++w.x) {
        this.drawCell(term, t, w, map, playerPos, farDist, blind, true);
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
   * Darkens a hex color by a given factor.
   *
   * @param {string} hexColor - The hex color to darken.
   * @param {number} factor - The factor by which to darken the color.
   * @return {string} The darkened hex color.
   */
  private static darkenColor(hexColor: string, factor: number): string {
    if (hexColor.startsWith('#')) {
      hexColor = hexColor.slice(1);
    }

    let r = parseInt(hexColor.slice(0, 2), 16);
    let g = parseInt(hexColor.slice(2, 4), 16);
    let b = parseInt(hexColor.slice(4, 6), 16);

    r = Math.floor(r * (1 - factor));
    g = Math.floor(g * (1 - factor));
    b = Math.floor(b * (1 - factor));

    const darkenedColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

    return darkenedColor;
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
          : this.darkenColor(envOnlyGlyphInfo.bgCol, 0.3);
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
      if (!cell.mob && cell.obj && cell.obj.spell != Spell.None)
        fg = SpellColors.c[cell.obj.spell][0];
    } else {
      if (cell.lit || cell.mob?.isPlayer) {
        fg =
          cell.env === Glyph.Unknown
            ? glyphInfo.bgCol
            : this.darkenColor(glyphInfo.fgCol, 0.0);
      } else {
        fg = this.unlitColor;
      }
    }

    return fg;
  }
}
