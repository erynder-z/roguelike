import { Buff } from '../gameLogic/buffs/buffEnum';
import { CanSee } from '../utilities/canSee';
import { DrawableTerminal } from '../types/terminal/drawableTerminal';
import { EnvEffect } from '../types/gameLogic/maps/mapModel/envEffect';
import { GameMapType } from '../types/gameLogic/maps/mapModel/gameMapType';
import { GameState } from '../types/gameBuilder/gameState';
import { Glyph } from '../gameLogic/glyphs/glyph';
import { GlyphInfo } from '../gameLogic/glyphs/glyphInfo';
import { GlyphMap } from '../gameLogic/glyphs/glyphMap';
import { ManipulateColors } from '../utilities/colors/manipulateColors';
import { MapCell } from '../maps/mapModel/mapCell';
import { Spell } from '../gameLogic/spells/spell';
import { SpellColors } from '../utilities/colors/spellColors';
import { TerminalPoint } from '../terminal/terminalPoint';
import { WorldPoint } from '../maps/mapModel/worldPoint';

/**
 * Sets each cell in the terminal to the appropriate glyph, information and colors.
 */
export class MapRenderer {
  public static outside: MapCell = new MapCell(Glyph.Unknown);
  private static unlitColor: string = '#111a24';
  private static unlitColorSolidBg: string = '#222';
  private static farLitColor: string = '#485460';

  /**
   * Draws a cell on the terminal based on the provided parameters.
   *
   * @param {DrawableTerminal} term - The terminal to draw on.
   * @param {TerminalPoint} tp - The position on the terminal to draw at.
   * @param {WorldPoint} wp - The position on the map to draw.
   * @param {GameMapType} map - The current map.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {number} farDist - The far distance for visibility.
   * @param {boolean} blind - Indicates if the player is blind.
   * @param {boolean} isRayCast - Indicates if the cell is being raycasted.
   * @return {void}
   */
  private static drawCell(
    term: DrawableTerminal,
    tp: TerminalPoint,
    wp: WorldPoint,
    map: GameMapType,
    playerPos: WorldPoint,
    farDist: number,
    blind: boolean,
    isRayCast: boolean,
  ): void {
    const cell = map.isLegalPoint(wp) ? map.cell(wp) : this.outside;
    const distance = wp.squaredDistanceTo(playerPos);
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
      : cell.glyphSpriteOrObjOrCorpseOrEnv();
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
      wp,
      map,
    );

    term.drawAt(tp.x, tp.y, glyphInfo.char, fg, bg);
  }

  /**
   * Checks the visibility of an entity based on various conditions.
   *
   * @param {MapCell} cell - The cell to check visibility for.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {GameMapType} map - The current map.
   * @param {boolean} far - Indicates if the entity is far from the player.
   * @param {boolean} blind - Indicates if the player is blind.
   * @return {boolean} Whether the entity is visible under the given conditions.
   */
  private static checkEntityVisibility(
    cell: MapCell,
    playerPos: WorldPoint,
    map: GameMapType,
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
   * @param {WorldPoint} wp - The world point.
   * @param {GameMapType} map - The current map.
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
    wp: WorldPoint,
    map: GameMapType,
  ): { fg: string; bg: string } {
    if (far || blind) {
      return {
        fg: this.getGeneralFgCol(cell, glyphInfo),
        bg: this.getGeneralBgCol(cell, glyphInfo),
      };
    }

    if (!cell.lit && !blind) cell.lit = true;

    if (isRayCast) {
      const isVisible = CanSee.checkPointLOS_RayCast(playerPos, wp, map);
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
   * Helper function that Iterates over each cell in the view and invokes a callback function for each cell.
   *
   * @param {DrawableTerminal} term - The terminal used for drawing.
   * @param {GameMapType} map - The map containing the cells.
   * @param {WorldPoint} vp - The view point on the map.
   * @param {Function} callback - The callback function to be executed for each cell.
   * @return {void}
   */
  private static forEachCellInView(
    term: DrawableTerminal,
    map: GameMapType,
    vp: WorldPoint,
    callback: (
      tp: TerminalPoint,
      wp: WorldPoint,
      term: DrawableTerminal,
      map: GameMapType,
    ) => void,
  ): void {
    const terminalDimensions = term.dimensions;
    const tp = new TerminalPoint();
    const wp = new WorldPoint();
    const mapOffSet = 0;

    for (
      tp.y = mapOffSet, wp.y = vp.y;
      tp.y < terminalDimensions.y + mapOffSet;
      ++tp.y, ++wp.y
    ) {
      for (tp.x = 0, wp.x = vp.x; tp.x < terminalDimensions.x; ++tp.x, ++wp.x) {
        callback(tp, wp, term, map);
      }
    }
  }

  /**
   * Draws the map normally based on the player's position and game state.
   *
   * @param {DrawableTerminal} term - The terminal used for drawing.
   * @param {GameMapType} map - The map to be drawn.
   * @param {WorldPoint} vp - The viewpoint on the map.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {GameState} game - The current game state.
   * @return {void}
   */
  public static drawMap_Standard(
    term: DrawableTerminal,
    map: GameMapType,
    vp: WorldPoint,
    playerPos: WorldPoint,
    game: GameState,
  ): void {
    const buffs = game.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);
    const farDist = CanSee.getFarDist(playerPos, map, game);

    this.forEachCellInView(term, map, vp, (tp, wp, term, map) => {
      this.drawCell(term, tp, wp, map, playerPos, farDist, blind, false);
    });
  }

  /**
   * Renders the map using ray casting technique.
   *
   * @param {DrawableTerminal} term - The terminal used for drawing.
   * @param {GameMapType} map - The map containing the cells.
   * @param {WorldPoint} vp - The view point on the map.
   * @param {WorldPoint} playerPos - The position of the player on the map.
   * @param {GameState} game - The game state object.
   * @return {void}
   */
  public static drawMap_RayCast(
    term: DrawableTerminal,
    map: GameMapType,
    vp: WorldPoint,
    playerPos: WorldPoint,
    game: GameState,
  ): void {
    const buffs = game.player.buffs;
    const blind = buffs && buffs.is(Buff.Blind);
    const farDist = CanSee.getFarDist(playerPos, map, game);

    this.forEachCellInView(term, map, vp, (tp, wp, term, map) => {
      this.drawCell(term, tp, wp, map, playerPos, farDist, blind, true);
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
    // If the glyph has a solid background and the cell is lit, return the solid background unlit color.
    if (glyphInfo.hasSolidBg && cell.lit) {
      return this.unlitColorSolidBg;
    }

    // Otherwise, return the default unlit color.
    return this.unlitColor;
  }

  /**
   * Calculates the foreground color of a cell based on its properties.
   *
   * @param {MapCell} cell - The cell to determine the color for.
   * @param {GlyphInfo} glyphInfo - The information about the glyph.
   * @return {string} The calculated foreground color.
   */
  private static getGeneralFgCol(cell: MapCell, glyphInfo: GlyphInfo): string {
    // If the cell is lit or if the player is on the cell and If the cell's environment is unknown, return the background color of the glyph
    if (cell.lit || cell.mob?.isPlayer) {
      if (cell.env === Glyph.Unknown) return glyphInfo.bgCol;

      // Otherwise, return the color used for far lit cells
      return this.farLitColor;
    }

    // If the cell is neither lit nor belongs to a player, return the unlit color.
    return this.unlitColor;
  }

  /**
   * Calculates the background color for a cell in ray casting mode.
   *
   * This method takes into account the visibility of the cell and applies the
   * appropriate darkness modifier. If the cell is bloody, it also tints the
   * background color with a red tone based on the blood intensity.
   *
   * @param {boolean} isVisible - Flag indicating if the cell is visible.
   * @param {MapCell} cell - The cell to determine the color for.
   * @return {string} The calculated background color.
   */
  private static getRayCastBgCol(isVisible: boolean, cell: MapCell): string {
    const envOnlyGlyphInfo = GlyphMap.getGlyphInfo(cell.env);
    let bgColor: string;

    if (isVisible) {
      bgColor = this.addEnvEffectsTint(
        envOnlyGlyphInfo.bgCol,
        cell.environment.effects,
      );
    } else {
      bgColor = ManipulateColors.darkenColor(envOnlyGlyphInfo.bgCol, 0.3);
    }

    if (cell.bloody && cell.bloody.isBloody) {
      const intensity = cell.bloody.intensity;
      const modifier_LOS = intensity * 0.2;
      const modifier_NO_LOS = intensity * 0.1;

      bgColor = isVisible
        ? this.addBloodiness(bgColor, modifier_LOS)
        : this.addBloodiness(bgColor, modifier_NO_LOS);
    }

    return bgColor;
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
    // If the cell is visible
    if (isVisible) {
      // If the cell is a visible trap with a corpse return a yellow color
      if (cell.env === Glyph.Visible_Trap && cell.corpse)
        return ManipulateColors.darkenColor('#f9ff5b', 0.2);

      // If the cell has an object with a spell, return the spell color
      /*   if (!cell.mob && cell.obj && cell.obj.spell !== Spell.None)
        return SpellColors.c[cell.obj.spell][0]; */

      // Otherwise, return the default foreground color
      return glyphInfo.fgCol;
      // If the cell is not visible
    } else {
      // If the cell is lit or if the player is on the cell and If the cell's environment is unknown, return the background color
      if (cell.lit || cell.mob?.isPlayer) {
        if (cell.env === Glyph.Unknown) return glyphInfo.bgCol;

        // Otherwise, darken the foreground color
        return ManipulateColors.darkenColor(glyphInfo.fgCol, 0.3);
      }

      // Return the unlit color if the cell is not visible and not lit
      return this.unlitColor;
    }
  }

  /**
   * Adds a tint to the given background color based on the specified environment effects.
   *
   * @param {string} bgColor - The background color to tint.
   * @param {EnvEffect[]} envEffects - The environment effects to consider.
   * @return {string} The tinted background color.
   */
  private static addEnvEffectsTint(
    bgColor: string,
    envEffects: EnvEffect[],
  ): string {
    if (envEffects.includes(EnvEffect.Confusion)) {
      return ManipulateColors.tintWithBlue(bgColor, 0.1);
    }
    if (envEffects.includes(EnvEffect.Poison)) {
      return ManipulateColors.tintWithPink(bgColor, 0.1);
    }
    return bgColor;
  }

  /**
   * Tints the given color with red to represent bloodiness based on the specified modifier.
   *
   * @param {string} color - The original color to be tinted.
   * @param {number} modifier - The intensity factor by which to tint the color with blood-red.
   * @return {string} The color tinted with red to represent bloodiness.
   */

  private static addBloodiness(color: string, modifier: number): string {
    return ManipulateColors.tintWithBlood(color, modifier);
  }
}
