import { Buff } from '../Buffs/BuffEnum';
import { CanSee } from '../Utilities/CanSee';
import { DrawableTerminal } from '../Terminal/Types/DrawableTerminal';
import { EnvEffect } from '../MapModel/Types/EnvEffect';
import { GameState } from '../Builder/Types/GameState';
import { Glyph } from '../Glyphs/Glyph';
import { GlyphInfo } from '../Glyphs/GlyphInfo';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { ManipulateColors } from '../Utilities/ManipulateColors';
import { MapCell } from '../MapModel/MapCell';
import { Map } from '../MapModel/Types/Map';
import { Spell } from '../Spells/Spell';
import { SpellColors } from '../Spells/SpellColors';
import { TerminalPoint } from '../Terminal/TerminalPoint';
import { WorldPoint } from '../MapModel/WorldPoint';

/**
 * Sets each cell in the terminal to the appropriate glyph, information and colors.
 */
export class MapRenderer {
  public static outside: MapCell = new MapCell(Glyph.Unknown);
  private static unlitColor: string = '#111a24';
  private static unlitColorSolidBg: string = '#222';
  private static farLitColor: string = '#485460';

  /**
   * Conditionally adds a tint to the background color based on the environment effects.
   *
   * @param {string} bgColor - The background color to tint.
   * @param {EnvEffect[]} envEffects - The array of environment effects.
   * @return {string} The tinted background color. If no tint is added, the original background color is returned.
   */
  private static maybeAddTintToColor(
    bgColor: string,
    envEffects: EnvEffect[],
  ): string {
    if (envEffects.includes(EnvEffect.Confusion)) {
      return ManipulateColors.tintWithRed(bgColor, 0.1);
    }
    if (envEffects.includes(EnvEffect.Poison)) {
      return ManipulateColors.tintWithPink(bgColor, 0.1);
    }
    return bgColor;
  }

  /**
   * Calculates the far distance for visibility based on player position, map, and game state.
   *
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {Map} map - The current map.
   * @param {GameState} g - The game state containing player stats.
   * @return {number} The calculated far distance for visibility.
   */
  private static getFarDist(
    playerPos: WorldPoint,
    map: Map,
    g: GameState,
  ): number {
    const glowRange = 10;
    const maxVisibilityRange = 75;
    let farDist = g.stats.currentVisRange || 50;

    const glowingRocks = this.countGlowingRocks(playerPos, map, glowRange);
    farDist *= Math.pow(2, glowingRocks);

    return Math.min(farDist, maxVisibilityRange);
  }

  /**
   * Draws a cell on the terminal based on the provided parameters.
   *
   * @param {DrawableTerminal} term - The terminal to draw on.
   * @param {TerminalPoint} t - The position on the terminal to draw at.
   * @param {WorldPoint} w - The position on the map to draw.
   * @param {Map} map - The current map.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {number} farDist - The far distance for visibility.
   * @param {boolean} blind - Indicates if the player is blind.
   * @param {boolean} isRayCast - Indicates if the cell is being raycasted.
   * @return {void}
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
  ): void {
    const cell = map.isLegalPoint(w) ? map.cell(w) : this.outside;
    const distance = w.squaredDistanceTo(playerPos);
    const far = distance > farDist && !blind;
    const isEntityVisible = this.checkEntityVisibility(
      cell,
      playerPos,
      map,
      far,
      blind,
    );

    const glyph = isEntityVisible
      ? cell.mob!.glyph
      : cell.glyphSpriteOrObjOrEnv();
    const glyphInfo = GlyphMap.getGlyphInfo(glyph);
    const envOnlyGlyphInfo = GlyphMap.getGlyphInfo(cell.env);

    const { fg, bg } = this.getCellColors(
      cell,
      glyphInfo,
      envOnlyGlyphInfo,
      far,
      blind,
      isRayCast,
      playerPos,
      w,
      map,
    );

    term.drawAt(t.x, t.y, glyphInfo.char, fg, bg);
  }

  /**
   * Checks the visibility of an entity based on various conditions.
   *
   * @param {MapCell} cell - The cell to check visibility for.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {Map} map - The current map.
   * @param {boolean} far - Indicates if the entity is far from the player.
   * @param {boolean} blind - Indicates if the player is blind.
   * @return {boolean} Whether the entity is visible under the given conditions.
   */
  private static checkEntityVisibility(
    cell: MapCell,
    playerPos: WorldPoint,
    map: Map,
    far: boolean,
    blind: boolean,
  ): boolean {
    return (
      !!cell.mob &&
      !far &&
      (!blind || cell.mob.isPlayer) &&
      CanSee.checkPointLOS_Bresenham(cell.mob.pos, playerPos, map, true)
    );
  }

  /**
   * Calculates the foreground and background colors for a cell based on various conditions.
   *
   * @param {MapCell} cell - The cell for which colors are being calculated.
   * @param {GlyphInfo} glyphInfo - The glyph information for the cell.
   * @param {GlyphInfo} envOnlyGlyphInfo - The environment-only glyph information for the cell.
   * @param {boolean} far - Indicates if the cell is far from the player.
   * @param {boolean} blind - Indicates if the player is blind.
   * @param {boolean} isRayCast - Indicates if ray casting is being used.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {WorldPoint} w - The world point.
   * @param {Map} map - The current map.
   * @return {{ fg: string; bg: string }} The foreground and background colors for the cell.
   */
  private static getCellColors(
    cell: MapCell,
    glyphInfo: GlyphInfo,
    envOnlyGlyphInfo: GlyphInfo,
    far: boolean,
    blind: boolean,
    isRayCast: boolean,
    playerPos: WorldPoint,
    w: WorldPoint,
    map: Map,
  ): { fg: string; bg: string } {
    if (far || blind) {
      return {
        fg: this.getGeneralFgCol(cell, glyphInfo),
        bg: this.getGeneralBgCol(cell, glyphInfo),
      };
    }

    if (!cell.lit && !blind) cell.lit = true;

    if (isRayCast) {
      const isVisible = CanSee.checkPointLOS_RayCast(playerPos, w, map);
      return {
        fg: this.getRayCastFgCol(isVisible, cell, glyphInfo),
        bg: this.getRayCastBgCol(isVisible, cell),
      };
    }

    let fg = glyphInfo.fgCol;
    if (!cell.mob && cell.obj && cell.obj.spell !== Spell.None) {
      fg = SpellColors.c[cell.obj.spell][0];
    }

    return { fg, bg: envOnlyGlyphInfo.bgCol };
  }

  /**
   * Counts the number of glowing rocks in the vicinity of the player position within a specified diameter.
   *
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {Map} map - The current map.
   * @param {number} diameter - The diameter within which to count glowing rocks.
   * @return {number} The count of glowing rocks in the specified vicinity.
   */
  private static countGlowingRocks(
    playerPos: WorldPoint,
    map: Map,
    diameter: number,
  ): number {
    let glowingRocksCount = 0;
    for (const neighbor of playerPos.getNeighbors(diameter * 0.5)) {
      if (map.isLegalPoint(neighbor) && map.cell(neighbor).isGlowing()) {
        glowingRocksCount++;
      }
    }
    return glowingRocksCount;
  }

  /**
   * Helper function that Iterates over each cell in the view and invokes a callback function for each cell.
   *
   * @param {DrawableTerminal} term - The terminal used for drawing.
   * @param {Map} map - The map containing the cells.
   * @param {WorldPoint} vp - The view point on the map.
   * @param {Function} callback - The callback function to be executed for each cell.
   * @return {void}
   */
  private static forEachCellInView(
    term: DrawableTerminal,
    map: Map,
    vp: WorldPoint,
    callback: (
      t: TerminalPoint,
      w: WorldPoint,
      term: DrawableTerminal,
      map: Map,
    ) => void,
  ): void {
    const terminalDimensions = term.dimensions;
    const t = new TerminalPoint();
    const w = new WorldPoint();
    const mapOffSet = 0;

    for (
      t.y = mapOffSet, w.y = vp.y;
      t.y < terminalDimensions.y + mapOffSet;
      ++t.y, ++w.y
    ) {
      for (t.x = 0, w.x = vp.x; t.x < terminalDimensions.x; ++t.x, ++w.x) {
        callback(t, w, term, map);
      }
    }
  }

  /**
   * Draws the map normally based on the player's position and game state.
   *
   * @param {DrawableTerminal} term - The terminal used for drawing.
   * @param {Map} map - The map to be drawn.
   * @param {WorldPoint} vp - The viewpoint on the map.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {GameState} g - The current game state.
   * @return {void}
   */
  public static drawMap_Standard(
    term: DrawableTerminal,
    map: Map,
    vp: WorldPoint,
    playerPos: WorldPoint,
    g: GameState,
  ): void {
    const buffs = g.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);
    const farDist = this.getFarDist(playerPos, map, g);

    this.forEachCellInView(term, map, vp, (t, w, term, map) => {
      this.drawCell(term, t, w, map, playerPos, farDist, blind, false);
    });
  }

  /**
   * Renders the map using ray casting technique.
   *
   * @param {DrawableTerminal} term - The terminal used for drawing.
   * @param {Map} map - The map containing the cells.
   * @param {WorldPoint} vp - The view point on the map.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {GameState} g - The game state object.
   * @return {void}
   */
  public static drawMap_RayCast(
    term: DrawableTerminal,
    map: Map,
    vp: WorldPoint,
    playerPos: WorldPoint,
    g: GameState,
  ): void {
    const buffs = g.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);
    const farDist = this.getFarDist(playerPos, map, g);

    this.forEachCellInView(term, map, vp, (t, w, term, map) => {
      this.drawCell(term, t, w, map, playerPos, farDist, blind, true);
    });
  }

  /**
   * Calculates the background color based on the solid background flag and cell lighting.
   *
   * @param {MapCell} cell - The map cell to determine background color for.
   * @param {GlyphInfo} glyphInfo - Information about the glyph.
   * @return {string} The background color for the cell.
   */
  private static getGeneralBgCol(cell: MapCell, glyphInfo: GlyphInfo): string {
    return glyphInfo.hasSolidBg && cell.lit
      ? this.unlitColorSolidBg
      : this.unlitColor;
  }

  /**
   * Calculates the foreground color of a cell based on its properties.
   *
   * @param {MapCell} cell - The cell to determine the color for.
   * @param {GlyphInfo} glyphInfo - The information about the glyph.
   * @return {string} The calculated foreground color.
   */
  private static getGeneralFgCol(cell: MapCell, glyphInfo: GlyphInfo): string {
    return cell.lit || cell.mob?.isPlayer
      ? cell.env === Glyph.Unknown
        ? glyphInfo.bgCol
        : this.farLitColor
      : this.unlitColor;
  }

  /**
   * Returns the background color for the raycast algorithm based on the visibility of the cell and its environment.
   *
   * @param {boolean} isVisible - Indicates whether the cell is visible or not.
   * @param {MapCell} cell - The map cell to determine the background color for.
   * @return {string} The calculated background color.
   */
  private static getRayCastBgCol(isVisible: boolean, cell: MapCell): string {
    const envOnlyGlyphInfo = GlyphMap.getGlyphInfo(cell.env);
    return isVisible
      ? this.maybeAddTintToColor(envOnlyGlyphInfo.bgCol, cell.envEffects)
      : ManipulateColors.darkenColor(envOnlyGlyphInfo.bgCol, 0.3);
  }

  /**
   * Calculates the foreground color of a cell for ray casting.
   *
   * @param {boolean} isVisible - Flag indicating if the cell is visible.
   * @param {MapCell} cell - The cell to determine the color for.
   * @param {GlyphInfo} glyphInfo - The information about the glyph.
   * @return {string} The calculated foreground color.
   */
  private static getRayCastFgCol(
    isVisible: boolean,
    cell: MapCell,
    glyphInfo: GlyphInfo,
  ): string {
    if (isVisible) {
      return !cell.mob && cell.obj && cell.obj.spell !== Spell.None
        ? SpellColors.c[cell.obj.spell][0]
        : glyphInfo.fgCol;
    }
    return cell.lit || cell.mob?.isPlayer
      ? cell.env === Glyph.Unknown
        ? glyphInfo.bgCol
        : ManipulateColors.darkenColor(glyphInfo.fgCol, 0.0)
      : this.unlitColor;
  }
}
