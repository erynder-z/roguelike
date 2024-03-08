import { Mob } from '../Mobs/Mob';
import { Glyph } from './Glyph';

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
