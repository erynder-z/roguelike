import { Mob } from '../Mobs/Mob';
import { Glyph } from '../Glyphs/Glyph';
import { ItemObject } from '../ItemObjects/ItemObject';
import { GlyphMap } from '../Glyphs/GlyphMap';
import { GlyphInfo } from '../Glyphs/GlyphInfo';

/**
 * Represents a cell on the game map.
 */
export class MapCell {
  constructor(public env: Glyph) {}

  mob: Mob | undefined;
  lit: boolean | undefined = false;
  obj: ItemObject | undefined;
  public sprite: Glyph | undefined;
  envDesc: string | undefined;

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
  glyph(): Glyph {
    return this.mob ? this.mob.glyph : this.env;
  }

  /**
   * Returns only the environment Glyph.
   *
   * @return {Glyph} the Glyph environment
   */
  glyphEnvOnly(): Glyph {
    return this.env;
  }

  /**
   * Returns object Glyph, if it exists and the environment Glyph otherwise.
   *
   * @return {Glyph} the Glyph object
   */
  glyphObjOrEnv(): Glyph {
    return this.obj ? this.obj.glyph : this.env;
  }

  /**
   * Returns the sprite glyph if it exists, otherwise returns the glyph of the object if it exists,
   * otherwise returns the environment glyph.
   *
   * @return {Glyph} The sprite glyph, object glyph, or environment glyph.
   */
  glyphSpriteOrObjOrEnv(): Glyph {
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
  hasObject(): boolean {
    return !!this.obj;
  }

  /**
   * Check if the cell is blocked.
   *
   * @return {boolean} true if the cell is blocked, false otherwise
   */
  isBlocked(): boolean {
    const isBlockingEnv = this.glyphInfo.isBlockingMovement || false;
    return !!this.mob || isBlockingEnv;
  }

  /**
   * Check if the environment of a cell is opaque.
   *
   * @return {boolean} true if the environment is opaque, false otherwise
   */
  isOpaque(): boolean {
    return this.glyphInfo.isOpaque || false;
  }

  /**
   * Check if the cell is slowing due to the environment.
   *
   * @return {boolean} true if the cell is slowing, false otherwise
   */
  isSlowing(): boolean {
    return this.glyphInfo.isSlowing || false;
  }

  /**
   * Check if the cell causes burn due to the environment.
   *
   * @return {boolean} true if the cell is causing burn, false otherwise
   */
  isBurning(): boolean {
    return this.glyphInfo.isBurning || false;
  }

  /**
   * Check if the cell is magnetic.
   *
   * @return {boolean} true if the cell is magnetic, false otherwise
   */
  isMagnetic(): boolean {
    return this.glyphInfo.isMagnetic || false;
  }
}
