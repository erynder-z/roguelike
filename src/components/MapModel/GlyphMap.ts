import { Glyph } from './Glyph';
import { GlyphInfo } from './GlyphInfo';

/**
 * Represents a map of glyphs and their corresponding information.
 */
export class GlyphMap {
  /**
   * An array containing information about each glyph.
   * @type {Array<GlyphInfo>}
   */
  static glyphsRegistry: Array<GlyphInfo> = [];
  /**
   * Information about the default or "bad" glyph.
   * @type {GlyphInfo}
   */
  static bad: GlyphInfo = new GlyphInfo(Glyph.Bad, '?');

  /**
   * Retrieves information about a specific glyph.
   * @param {Glyph} glyph - The glyph to retrieve information for.
   * @returns {GlyphInfo} Information about the glyph.
   */
  static getGlyphInfo(glyph: Glyph): GlyphInfo {
    return glyph in GlyphMap.glyphsRegistry
      ? GlyphMap.glyphsRegistry[glyph]
      : GlyphMap.bad;
  }

  /**
   * Initializes the glyph map with default glyphs.
   * @returns {number} The number of glyphs initialized.
   */
  static ensureInit: number = GlyphMap.initializeGlyphs();
  static initializeGlyphs(): number {
    const add = GlyphMap.addGlyph;
    add('@', Glyph.Player);
    add('§', Glyph.Bad);
    add('%', Glyph.Rock);
    add('#', Glyph.Wall);
    add('.', Glyph.Floor);
    add('P', Glyph.Pawn);
    add('K', Glyph.Knight);
    add('C', Glyph.Cat);
    add('A', Glyph.Ant);
    add('?', Glyph.Unknown);
    add('<', Glyph.StairsUp);
    add('>', Glyph.StairsDown);
    add(',', Glyph.Door_Open);
    add('+', Glyph.Door_Closed);
    return GlyphMap.glyphsRegistry.length;
  }

  /**
   * Adds a new glyph to the glyph map.
   * @param {string} char - The character representation of the glyph.
   * @param {Glyph} glyph - The glyph to add.
   */
  static addGlyph(char: string, glyph: Glyph) {
    const info: GlyphInfo = new GlyphInfo(glyph, char);
    GlyphMap.warn(glyph);
    GlyphMap.glyphsRegistry[glyph] = info;
  }

  /**
   * Warns if the number of glyphs in the registry differs from the expected value.
   * @param {Glyph} glyph - The glyph to compare with the registry.
   */
  static warn(glyph: Glyph) {
    if (GlyphMap.glyphsRegistry.length == glyph) {
      return;
    }
    console.log(glyph, 'differs from', GlyphMap.glyphsRegistry.length);
  }
}
