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

  /**
   * Gets the environment glyph of the cell.
   * @returns {Glyph} The environment glyph.
   */
  glyph(): Glyph {
    return this.env;
  }
}
