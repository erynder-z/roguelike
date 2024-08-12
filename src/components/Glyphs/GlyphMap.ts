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
  /**
   * An array containing information about each glyph.
   * @type {Array<GlyphInfo>}
   */
  private static glyphsRegistry: Array<GlyphInfo> = [];
  private static ensureInit: number = GlyphMap.initializeGlyphs();
  /**
   * Information about the default or "bad" glyph.
   * @type {GlyphInfo}
   */
  private static bad: GlyphInfo = new GlyphInfo(
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
   * @returns {GlyphInfo} Information about the glyph.
   */
  public static getGlyphInfo(glyph: Glyph): GlyphInfo {
    return glyph in GlyphMap.glyphsRegistry
      ? GlyphMap.glyphsRegistry[glyph]
      : GlyphMap.bad;
  }

  /**
   * Initializes the glyph map with default glyphs.
   * @returns {number} The number of glyphs initialized.
   */

  private static initializeGlyphs(): number {
    const addGlyph = (info: GlyphInfo) => {
      const glyph = Glyph[info.name as keyof typeof Glyph];

      const glyphInfo = new GlyphInfo(
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
      GlyphMap.glyphsRegistry[glyph] = glyphInfo;
    };

    // add player glyph
    addGlyph(<GlyphInfo>{
      char: '@',
      bgCol: '#4B5A52',
      fgCol: '#ffffff',
      hasSolidBg: false,
      name: 'Player',
      description: 'The player character. You are here.',
    });

    environmentData['environment'].forEach(env => addGlyph(<GlyphInfo>env));
    mobsData['mobs'].forEach(mob => addGlyph(<GlyphInfo>mob));
    itemData['items'].forEach(item => addGlyph(<GlyphInfo>item));
    corpseData['corpses'].forEach(corpse => addGlyph(<GlyphInfo>corpse));

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
    name: string,
    desc: string,
    isOpaque: boolean,
    isBlockingMovement: boolean,
    isBlockingProjectiles: boolean,
    isDiggable: boolean,
    isCausingSlow: boolean,
    isCausingBurn: boolean,
    isMagnetic: boolean,
    isCausingBleed: boolean,
    isGlowing: boolean,
    isCausingPoison: boolean,
    isCausingConfusion: boolean,
  ) {
    const info: GlyphInfo = new GlyphInfo(
      fgCol,
      bgCol,
      hasSolidBg,
      char,
      name,
      desc,
      isOpaque,
      isBlockingMovement,
      isBlockingProjectiles,
      isDiggable,
      isCausingSlow,
      isCausingBurn,
      isMagnetic,
      isCausingBleed,
      isGlowing,
      isCausingPoison,
      isCausingConfusion,
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

  /**
   * Converts an index to a glyph.
   * @param {number} index - The index to convert.
   * @returns {Glyph} The corresponding glyph.
   * @throws {string} Throws an error if the index is negative or too large.
   */
  static max: number = Object.keys(GlyphMap.glyphsRegistry).length / 2;

  /**
   * Converts an index to a glyph.
   * @param {number} index - The index to convert.
   * @returns {Glyph} The corresponding glyph.
   * @throws {string} Throws an error if the index is negative or too large.
   */
  static indexToGlyph(index: number): Glyph {
    if (index < 0) throw `index ${index} is negative`;
    if (index >= GlyphMap.max) throw `index ${index} is too large`;
    const g: Glyph = <Glyph>index;
    return g;
  }

  /**
   * Retrieves the description of a glyph based on its category.
   *
   * @param {Glyph} glyph - The glyph to retrieve the description for.
   * @param {'mob' | 'environment' | 'item'} category - The category of the glyph.
   * @return {string} The description of the glyph, or 'no description' if not found.
   */
  static getGlyphDescription(
    glyph: Glyph,
    category: 'mob' | 'environment' | 'object' | 'corpse',
  ): string {
    let description = 'no description';

    switch (category) {
      case 'mob': {
        const mob = mobsData.mobs.find(mob => mob.name === Glyph[glyph]);
        description = mob?.description || description;
        break;
      }
      case 'environment': {
        const environment = environmentData.environment.find(
          env => env.name === Glyph[glyph],
        );
        description = environment?.description || description;
        break;
      }
      case 'object': {
        const object = itemData.items.find(item => item.name === Glyph[glyph]);
        description = object?.description || description;
        break;
      }
      case 'corpse': {
        const corpse = corpseData.corpses.find(
          corpse => corpse.name === Glyph[glyph],
        );
        description = corpse?.description || description;
        break;
      }
      default:
        break;
    }

    return description;
  }
}
