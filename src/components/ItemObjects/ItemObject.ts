import { Glyph } from '../Glyphs/Glyph';
import { Slot } from './Slot';

/**
 * Represents an item object in the game world.
 */
export class ItemObject {
  level: number = 0;

  /**
   * Creates an instance of ItemObject.
   * @param {Glyph} glyph - The glyph representing the item.
   * @param {Slot} slot - The slot in which the item can be equipped.
   */
  constructor(
    public glyph: Glyph,
    public slot: Slot,
  ) {}

  /**
   * Generates a description of the item object.
   * @returns {string} The description of the item object.
   */
  description(): string {
    const label = this.name();
    return `${label} lvl: ${this.level}`;
  }

  /**
   * Retrieves the name of the item based on its glyph.
   * @returns {string} The name of the item.
   */
  name(): string {
    return Glyph[this.glyph];
  }
}
