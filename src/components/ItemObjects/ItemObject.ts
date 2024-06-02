import { Glyph } from '../Glyphs/Glyph';
import { Spell } from '../Spells/Spell';
import { SpellColors } from '../Spells/SpellColors';
import { Slot } from './Slot';

/**
 * Represents an item object in the game world.
 */
export class ItemObject {
  level: number = 0;
  desc: string = '';
  charges: number = 0;

  /**
   * Creates an instance of ItemObject.
   * @param {Glyph} glyph - The glyph representing the item.
   * @param {Slot} slot - The slot in which the item can be equipped.
   * @param {Spell} spell - The spell that the item can cast.
   */
  constructor(
    public glyph: Glyph,
    public slot: Slot,
    public spell: Spell = Spell.None,
  ) {}

  /**
   * Generates a description of the item object.
   * @returns {string} The description of the item object.
   */
  description(): string {
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
  name(): string {
    return Glyph[this.glyph];
  }
}
