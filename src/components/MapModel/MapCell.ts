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

  /**
   * Return the glyph of the mob if it exists, otherwise return the environment glyph.
   *
   * @return {Glyph} the glyph of the mob if it exists, otherwise the environment glyph
   */
  glyph(): Glyph {
    return this.mob ? this.mob.glyph : this.env;
  }

  /**
   * Check if the cell is blocked.
   *
   * @return {boolean} true if the cell is blocked, false otherwise
   */
  isBlocked(): boolean {
    return (
      !!this.mob ||
      this.env === Glyph.Wall ||
      this.env === Glyph.Door_Closed ||
      this.env === Glyph.Rock
    );
  }
}
