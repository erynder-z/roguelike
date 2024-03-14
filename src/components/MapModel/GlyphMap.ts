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
    const bgColor = 1 ? '#F8F8FF' : '#000';
    const add = GlyphMap.addGlyph;

    // Player
    add(bgColor, '#B22222', false, '@', Glyph.Player);

    // Terrain
    add(bgColor, '#696969', false, '.', Glyph.Floor);
    add('#A9A9A9', '#808080', true, '%', Glyph.Rock);
    add('#2F4F4F', '#556B2F', true, '#', Glyph.Wall);

    // Monsters
    add(bgColor, '#8A3324', false, 'a', Glyph.Ant);
    add(bgColor, '#0000FF', false, 'b', Glyph.Bat);
    add(bgColor, '#2E8B57', false, 'c', Glyph.Cat);
    add(bgColor, '#D2691E', false, 'd', Glyph.Dog);
    add(bgColor, '#9932CC', false, 'e', Glyph.Ectoplasm);
    add(bgColor, '#8FBC8F', false, 'f', Glyph.Frog);
    add(bgColor, '#708090', false, 'g', Glyph.Gargoyle);
    add(bgColor, '#4682B4', false, 'h', Glyph.Harpy);
    add(bgColor, '#FF4500', false, 'i', Glyph.Imp);
    add(bgColor, '#8B4513', false, 'j', Glyph.Jackal);
    add(bgColor, '#20B2AA', false, 'k', Glyph.Kappa);
    add(bgColor, '#FFA07A', false, 'l', Glyph.Lama);
    add(bgColor, '#800080', false, 'm', Glyph.Mutant);
    add(bgColor, '#A0522D', false, 'n', Glyph.Nook);
    add(bgColor, '#556B2F', false, 'o', Glyph.Ogre);
    add(bgColor, '#FF69B4', false, 'p', Glyph.Pig);
    add(bgColor, '#FFD700', false, 'q', Glyph.Qilin);
    add(bgColor, '#696969', false, 'r', Glyph.Rat);
    add(bgColor, '#8B008B', false, 's', Glyph.Succubus);
    add(bgColor, '#FF6347', false, 't', Glyph.Tengu);
    add(bgColor, '#FF00FF', false, 'u', Glyph.Unicorn);
    add(bgColor, '#800000', false, 'v', Glyph.Vampire);
    add(bgColor, '#FF0000', false, 'w', Glyph.Wyrm);
    add(bgColor, '#00FF00', false, 'x', Glyph.Xelhua);
    add(bgColor, '#DAA520', false, 'y', Glyph.Yeti);
    add(bgColor, '#00CED1', false, 'z', Glyph.Zombie);

    // Other glyphs
    add('#000000', '#191970', false, '?', Glyph.Unknown);
    add('#FF6347', '#C71585', false, '<', Glyph.StairsUp);
    add('#00FF7F', '#C71585', false, '>', Glyph.StairsDown);
    add(bgColor, '#C71585', false, "'", Glyph.Door_Open);
    add(bgColor, '#C71585', false, '+', Glyph.Door_Closed);
    add('#FF6347', '#FF0000', false, '§', Glyph.Bad);

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
