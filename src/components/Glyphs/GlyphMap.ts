import * as corpseData from '../Mobs/MobData/corpses.json';
import * as environmentData from '../Environment/EnvironmentData/environment.json';
import * as itemData from '../ItemObjects/ItemData/items.json';
import { Glyph } from './Glyph';
import { GlyphInfo } from './GlyphInfo';
import * as mobsData from '../Mobs/MobData/mobs.json';

/**
 * Represents a map of glyphs and their corresponding information.
 */
export class GlyphMap {
  private static glyphsRegistry: Map<Glyph, GlyphInfo> = new Map();
  private static defaultGlyph: GlyphInfo = new GlyphInfo(
    'Bad',
    'red',
    'yellow',
    false,
    '?',
    'bad',
    'an unknown glyph',
  );

  /**
   * Retrieves information about a specific glyph.
   * @param {Glyph} glyph - The glyph to retrieve information for.
   * @returns {GlyphInfo} Information about the glyph, or the default bad glyph if not found.
   */
  public static getGlyphInfo(glyph: Glyph): GlyphInfo {
    return GlyphMap.glyphsRegistry.get(glyph) || GlyphMap.defaultGlyph;
  }

  /**
   * Initializes the glyphs registry by adding glyphs from various data sources asynchronously.
   * @returns {Promise<number>} The size of the glyphs registry after initialization.
   */
  public static async initializeGlyphs(): Promise<number> {
    const addGlyph = (info: GlyphInfo) => {
      const glyph = Glyph[info.id as keyof typeof Glyph];
      const glyphInfo = new GlyphInfo(
        info.id,
        info.fgCol,
        info.bgCol,
        info.hasSolidBg,
        info.char,
        info.name,
        info.description,
        info.isOpaque,
        info.isBlockingMovement,
        info.isBlockingProjectiles,
        info.isDiggable,
        info.isCausingSlow,
        info.isCausingBurn,
        info.isMagnetic,
        info.isCausingBleed,
        info.isGlowing,
        info.isCausingPoison,
        info.isCausingConfusion,
      );
      GlyphMap.glyphsRegistry.set(glyph, glyphInfo);
    };

    // Adding glyphs for player, environment, mobs, items and corpses
    [
      {
        id: 'Player',
        char: '@',
        bgCol: '#4B5A52',
        fgCol: '#ffffff',
        hasSolidBg: false,
        name: 'Player',
        description: "That's you.",
      },
      ...environmentData['environment'],
      ...mobsData['mobs'],
      ...itemData['items'],
      ...corpseData['corpses'],
    ].forEach(data => addGlyph(<GlyphInfo>data));

    return GlyphMap.glyphsRegistry.size;
  }

  /**
   * Adds a new glyph to the glyph map.
   * @param {GlyphInfo} info - The glyph information to add.
   * @param {Glyph} glyph - The corresponding glyph to associate with the info.
   */
  static addGlyph(info: GlyphInfo, glyph: Glyph) {
    GlyphMap.glyphsRegistry.set(glyph, info);
  }

  /**
   * Logs a warning if the registry size doesn't match the expected value.
   * @param {Glyph} glyph - The glyph to compare with the registry.
   */
  static warn(glyph: Glyph) {
    if (GlyphMap.glyphsRegistry.size === glyph) {
      return;
    }
    console.warn(
      `${glyph} differs from the registry size: ${GlyphMap.glyphsRegistry.size}`,
    );
  }

  /**
   * Converts an index to a glyph.
   * @param {number} index - The index to convert.
   * @returns {Glyph} The corresponding glyph.
   * @throws {Error} Throws an error if the index is out of bounds.
   */
  static indexToGlyph(index: number): Glyph {
    if (index < 0 || index >= GlyphMap.glyphsRegistry.size) {
      throw new Error(`Index ${index} is out of bounds`);
    }
    return Array.from(GlyphMap.glyphsRegistry.keys())[index];
  }

  /**
   * Retrieves the description of a glyph based on its category.
   *
   * @param {Glyph} glyph - The glyph to retrieve the description for.
   * @param {'mob' | 'environment' | 'object' | 'corpse'} category - The category of the glyph.
   * @return {string} The description of the glyph, or 'no description' if not found.
   */
  static getGlyphDescription(
    glyph: Glyph,
    category: 'mob' | 'environment' | 'object' | 'corpse',
  ): string {
    const description = 'no description';

    const dataSources = {
      mob: mobsData.mobs,
      environment: environmentData.environment,
      object: itemData.items,
      corpse: corpseData.corpses,
    };

    const glyphData = dataSources[category]?.find(
      item => item.id === Glyph[glyph] || item.name === Glyph[glyph],
    );

    return glyphData?.description || description;
  }
}
