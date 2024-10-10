import { Glyph } from '../glyphs/glyph';
import { GlyphMap } from '../glyphs/glyphMap';
import { Slot } from './slot';
import { Spell } from '../spells/spell';
import { SpellColors } from '../../utilities/colors/spellColors';

/**
 * Represents an item object in the game world.
 */
export class ItemObject {
  constructor(
    public glyph: Glyph,
    public slot: Slot,
    public spell: Spell = Spell.None,
    public level: number = 0,
    public desc: string = '',
    public charges: number = 0,
  ) {}

  /**
   * Generates a description of the item object.
   * @returns {string} The description of the item object.
   */
  public description(): string {
    const label = this.name();

    if (this.spell != Spell.None) {
      const quality = SpellColors.c[this.spell][1];
      return `${quality}  ${label}`;
    }

    return `${label}: ${this.level}`;
  }

  /**
   * Retrieves the name of the item based on its glyph.
   * @returns {string} The name of the item.
   */
  public name(): string {
    return GlyphMap.getGlyphInfo(this.glyph).name;
  }
}