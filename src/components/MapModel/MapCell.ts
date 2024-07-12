import { Glyph } from '../Glyphs/Glyph';
import { GlyphInfo } from '../Glyphs/GlyphInfo';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { ItemObject } from '../ItemObjects/ItemObject';
import { Mob } from '../Mobs/Mob';

/**
 * Represents a cell on the game map.
 */
export class MapCell {
  constructor(public env: Glyph) {}

  public mob: Mob | undefined;
  public lit: boolean | undefined = false;
  public obj: ItemObject | undefined;
  public sprite: Glyph | undefined;
  public envDesc: string | undefined;

  /**
   * Dynamically retrieves the glyph information based on the current environment.
   *
   * @return {GlyphInfo} the glyph information
   */
  private get glyphInfo(): GlyphInfo {
    return GlyphMap.getGlyphInfo(this.env);
  }

  /**
   * Return the glyph of the mob if it exists, otherwise return the environment glyph.
   *
   * @return {Glyph} the glyph of the mob if it exists, otherwise the environment glyph
   */
  public glyph(): Glyph {
    return this.mob ? this.mob.glyph : this.env;
  }

  /**
   * Returns only the environment Glyph.
   *
   * @return {Glyph} the Glyph environment
   */
  public glyphEnvOnly(): Glyph {
    return this.env;
  }

  /**
   * Returns object Glyph, if it exists and the environment Glyph otherwise.
   *
   * @return {Glyph} the Glyph object
   */
  public glyphObjOrEnv(): Glyph {
    return this.obj ? this.obj.glyph : this.env;
  }

  /**
   * Returns the sprite glyph if it exists, otherwise returns the glyph of the object if it exists,
   * otherwise returns the environment glyph.
   *
   * @return {Glyph} The sprite glyph, object glyph, or environment glyph.
   */
  public glyphSpriteOrObjOrEnv(): Glyph {
    if (this.sprite) {
      return this.sprite;
    }
    return this.obj ? this.obj.glyph : this.env;
  }

  /**
   * Checks if the current cell has an object on it
   *
   * @return {boolean} Returns true if the object property is truthy, false otherwise.
   */
  public hasObject(): boolean {
    return !!this.obj;
  }

  /**
   * Check if the cell is blocked.
   *
   * @return {boolean} true if the cell is blocked, false otherwise
   */
  public isBlocked(): boolean {
    const isBlockingEnv = this.glyphInfo.isBlockingMovement || false;
    return !!this.mob || isBlockingEnv;
  }

  /**
   * Check if the environment of a cell is opaque.
   *
   * @return {boolean} true if the environment is opaque, false otherwise
   */
  public isOpaque(): boolean {
    return this.glyphInfo.isOpaque || false;
  }

  /**
   * Check if the cell is slowing due to the environment.
   *
   * @return {boolean} true if the cell is slowing, false otherwise
   */
  public isCausingSlow(): boolean {
    return this.glyphInfo.isCausingSlow || false;
  }

  /**
   * Check if the cell causes burn due to the environment.
   *
   * @return {boolean} true if the cell is causing burn, false otherwise
   */
  public isCausingBurn(): boolean {
    return this.glyphInfo.isCausingBurn || false;
  }

  /**
   * Check if the cell is magnetic.
   *
   * @return {boolean} true if the cell is magnetic, false otherwise
   */
  public isMagnetic(): boolean {
    return this.glyphInfo.isMagnetic || false;
  }

  /**
   * Check if the cell is causing bleed due to the environment.
   *
   * @return {boolean} true if the cell is causing bleed, false otherwise
   */
  public isCausingBleed(): boolean {
    return this.glyphInfo.isCausingBleed || false;
  }
}
