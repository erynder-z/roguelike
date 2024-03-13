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
  static bad: GlyphInfo = new GlyphInfo(Glyph.Bad, 'red', 'yellow', false, '?');

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
    add(bgColor, 'fireBrick', false, '@', Glyph.Player);
    add('red', 'yellow', false, '§', Glyph.Bad);
    add('darkGrey', 'darkOliveGreen', true, '%', Glyph.Rock);
    add('darkSlateGrey', 'cadetBlue', true, '#', Glyph.Wall);
    add(bgColor, 'olive', false, '.', Glyph.Floor);
    add(bgColor, 'royalBlue', false, 'p', Glyph.Pawn);
    add(bgColor, 'saddleBrown', false, 'b', Glyph.Bat);
    add(bgColor, 'seaGreen', false, 'c', Glyph.Cat);
    add(bgColor, 'orangeRed', false, 'a', Glyph.Ant);
    add('black', 'midnightBlue', false, '?', Glyph.Unknown);
    add('tomato', 'mediumVioletRed', false, '<', Glyph.StairsUp);
    add('springGreen', 'mediumVioletRed', false, '>', Glyph.StairsDown);
    add(bgColor, 'mediumVioletRed', false, '-', Glyph.Door_Open);
    add(bgColor, 'mediumVioletRed', false, '‡', Glyph.Door_Closed);
    return GlyphMap.glyphsRegistry.length;
  }

  /**
   * Adds a new glyph to the glyph map.
   * @param {string} char - The character representation of the glyph.
   * @param {Glyph} glyph - The glyph to add.
   */
  static addGlyph(
    bgCol: string,
    fgCol: string,
    hasSolidBg: boolean,
    char: string,
    glyph: Glyph,
  ) {
    const info: GlyphInfo = new GlyphInfo(
      glyph,
      fgCol,
      bgCol,
      hasSolidBg,
      char,
    );
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
