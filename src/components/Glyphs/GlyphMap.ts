import { GlyphInfo } from './GlyphInfo';
import { Glyph } from './Glyph';

/**
 * Represents a map of glyphs and their corresponding information.
 */
export class GlyphMap {
  /**
   * An array containing information about each glyph.
   * @type {Array<GlyphInfo>}
   */
  private static glyphsRegistry: Array<GlyphInfo> = [];

  /**
   * Information about the default or "bad" glyph.
   * @type {GlyphInfo}
   */
  private static bad: GlyphInfo = new GlyphInfo(
    'Bad', // id
    'red', // fgCol
    'yellow', // bgCol
    false, // hasSolidBg
    '?', // char
    'bad', // name
    'an unknown glyph', // description
    true, // isOpaque
    false, // isBlockingMovement
    false, // isBlockingProjectiles
    false, // isDiggable
    false, // isCausingSlow
    false, // isCausingBurn
    false, // isMagnetic
    false, // isCausingBleed
    false, // isGlowing
    false, // isCausingPoison
    false, // isCausingConfusion
  );

  /**
   * Retrieves information about a specific glyph.
   * @param {Glyph} glyph - The glyph to retrieve information for.
   * @returns {GlyphInfo} Information about the glyph.
   */
  public static getGlyphInfo(glyph: Glyph): GlyphInfo {
    return GlyphMap.glyphsRegistry[glyph] || GlyphMap.bad;
  }

  /**
   * Adds a new glyph to the glyph map.
   * @param {GlyphInfo} info - The information of the glyph to add.
   */
  public static addGlyph(info: GlyphInfo): void {
    const glyph = Glyph[info.id as keyof typeof Glyph];
    if (glyph === undefined) {
      console.warn(`Glyph ID "${info.id}" is not defined in Glyph enum.`);
      return;
    }
    GlyphMap.glyphsRegistry[glyph] = info;
    GlyphMap.warn(glyph);
  }

  /**
   * Warns if the number of glyphs in the registry differs from the expected value.
   * @param {Glyph} glyph - The glyph to compare with the registry.
   */
  private static warn(glyph: Glyph): void {
    if (GlyphMap.glyphsRegistry.length === Object.keys(Glyph).length) {
      return;
    }
    console.log(
      `Glyph ${glyph} differs from registry size ${GlyphMap.glyphsRegistry.length}`,
    );
  }

  /**
   * Converts an index to a glyph.
   * @param {number} index - The index to convert.
   * @returns {Glyph} The corresponding glyph.
   * @throws {Error} Throws an error if the index is out of bounds.
   */
  public static indexToGlyph(index: number): Glyph {
    const maxIndex = GlyphMap.glyphsRegistry.length - 1;

    if (index < 0) throw new Error(`Index ${index} is negative.`);
    if (index > maxIndex)
      throw new Error(`Index ${index} is too large; max is ${maxIndex}.`);

    return index as Glyph;
  }

  /**
   * Retrieves the description of a glyph based on its category.
   *
   * @param {Glyph} glyph - The glyph to retrieve the description for.
   * @return {string} The description of the glyph, or 'no description' if not found.
   */
  public static getGlyphDescription(glyph: Glyph): string {
    const info = GlyphMap.glyphsRegistry[glyph];
    return info?.description || 'no description';
  }

  /**
   * Gets the current size of the glyph registry.
   * @returns {number} The number of glyphs in the registry.
   */
  public static getRegistrySize(): number {
    return GlyphMap.glyphsRegistry.length;
  }

  /**
   * Retrieves all glyphs in the registry.
   * @returns {Array<GlyphInfo>} Array of all glyph information.
   */
  public static getAllGlyphs(): Array<GlyphInfo> {
    return GlyphMap.glyphsRegistry;
  }
}
