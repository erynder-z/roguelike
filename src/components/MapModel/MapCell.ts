import { Mob } from '../Mobs/Mob';
import { Glyph } from '../Glyphs/Glyph';
import { ItemObject } from '../ItemObjects/ItemObject';

/**
 * Represents a cell on the game map.
 */
export class MapCell {
  /**
   * Creates an instance of MapCell.
   * @param {Glyph} env - The environment glyph of the cell.
   */
  constructor(public env: Glyph) {}

  mob: Mob | undefined;
  lit: boolean | undefined = false;
  obj: ItemObject | undefined;

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
    return !!this.mob || this.isOpaque();
  }

  /**
   * Check if the environment of a cell is opaque.
   *
   * @return {boolean} true if the environment is opaque, false otherwise
   */
  isOpaque(): boolean {
    return (
      this.env === Glyph.Rock ||
      this.env === Glyph.Wall ||
      this.env === Glyph.Door_Closed
    );
  }
}
