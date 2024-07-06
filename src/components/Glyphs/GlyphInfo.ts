/**
 * Represents information about a glyph.
 */
export class GlyphInfo {
  constructor(
    public fgCol: string,
    public bgCol: string,
    public hasSolidBg: boolean,
    public char: string,
    public name: string,
    public description: string,
    public isOpaque: boolean,
    public isBlockingMovement: boolean,
    public isBlockingProjectiles: boolean,
    public isDiggable: boolean,
    public isSlowing: boolean,
    public isBurning: boolean,
    public isMagnetic: boolean,
  ) {}
}
