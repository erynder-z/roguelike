import { Glyph } from './Glyph';

/**
 * Represents information about a glyph, including its symbol and corresponding character.
 */
export class GlyphInfo {
  /**
   * Creates an instance of GlyphInfo.
   * @param {Glyph} glyph - The glyph type.
   * @param {string} char - The character representation of the glyph.
   */
  constructor(
    public glyph: Glyph,
    public fgCol: string,
    public bgCol: string,
    public char: string,
  ) {}
}
