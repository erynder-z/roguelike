import { Glyph } from './Glyph';

/**
 * Represents information about a glyph, including its symbol and corresponding character.
 */
export class GlyphInfo {
  constructor(
    public glyph: Glyph,
    public fgCol: string,
    public bgCol: string,
    public hasSolidBg: boolean,
    public char: string,
  ) {}
}
