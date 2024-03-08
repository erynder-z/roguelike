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
  static bad: GlyphInfo = new GlyphInfo(Glyph.Bad, 'red', 'yellow', '?');

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
    // eslint-disable-next-line no-constant-condition
    const bgColor = 1 ? '#F0FFF0' : '#000';
    const add = GlyphMap.addGlyph;
    add(bgColor, 'fireBrick', '@', Glyph.Player);
    add('red', 'yellow', '§', Glyph.Bad);
    add('darkGrey', 'darkOliveGreen', '%', Glyph.Rock);
    add('darkSlateGrey', 'cadetBlue', '#', Glyph.Wall);
    add(bgColor, 'olive', '.', Glyph.Floor);
    add(bgColor, 'royalBlue ', '屍', Glyph.Pawn);
    add(bgColor, 'saddleBrown', '🦇', Glyph.Bat);
    add(bgColor, 'seaGreen', '🐈', Glyph.Cat);
    add(bgColor, 'orangeRed ', '🐜', Glyph.Ant);
    add('black', 'midnightBlue', '?', Glyph.Unknown);
    add(bgColor, 'mediumVioletRed ', '<', Glyph.StairsUp);
    add(bgColor, 'mediumVioletRed', '>', Glyph.StairsDown);
    add(bgColor, 'mediumVioletRed', '-', Glyph.Door_Open);
    add(bgColor, 'mediumVioletRed', '‡', Glyph.Door_Closed);
    return GlyphMap.glyphsRegistry.length;
  }

  /**
   * Adds a new glyph to the glyph map.
   * @param {string} char - The character representation of the glyph.
   * @param {Glyph} glyph - The glyph to add.
   */
  static addGlyph(bgCol: string, fgCol: string, char: string, glyph: Glyph) {
    const info: GlyphInfo = new GlyphInfo(glyph, bgCol, fgCol, char);
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
