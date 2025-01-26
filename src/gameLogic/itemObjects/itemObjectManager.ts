import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { Glyph } from '../glyphs/glyph';
import { ItemObject } from './itemObject';
import { ObjCategory } from './itemCategories';
import { ObjectTypes } from '../../types/gameLogic/itemObjects/objTypes';
import { RandomGenerator } from '../../randomGenerator/randomGenerator';
import { Slot } from './slot';
import { Spell } from '../spells/spell';
import spellData from '../../gameLogic/spells/spellData/spells.json';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

/**
 * Represents a collection of objects (items) in the game world.
 */
export class ItemObjectManager {
  private static objTypes: ObjectTypes[] = [
    {
      glyph: Glyph.Dagger,
      slot: Slot.MainHand,
      category: [ObjCategory.MeleeWeapon],
    },
    { glyph: Glyph.Shield, slot: Slot.OffHand, category: [ObjCategory.Armor] },
    { glyph: Glyph.Cap, slot: Slot.Head, category: [ObjCategory.Armor] },
    { glyph: Glyph.Gloves, slot: Slot.Hands, category: [ObjCategory.Armor] },
    { glyph: Glyph.Cape, slot: Slot.Back, category: [ObjCategory.Armor] },
    { glyph: Glyph.Pants, slot: Slot.Legs, category: [ObjCategory.Armor] },
    { glyph: Glyph.Boots, slot: Slot.Feet, category: [ObjCategory.Armor] },
    {
      glyph: Glyph.Potion,
      slot: Slot.NotWorn,
      category: [ObjCategory.Consumable],
    },
    {
      glyph: Glyph.Rune,
      slot: Slot.NotWorn,
      category: [ObjCategory.SpellItem],
    },
    {
      glyph: Glyph.Scroll,
      slot: Slot.NotWorn,
      category: [ObjCategory.SpellItem],
    },
    {
      glyph: Glyph.Pistol,
      slot: Slot.NotWorn,
      category: [ObjCategory.RangedWeapon],
    },
  ];

  private static highestSpellTier: number = Spell.None;

  /**
   * Retrieves the index of an object type based on its glyph.
   * @param {Glyph} glyph - The glyph of the object type.
   * @returns {number} The index of the object type.
   */
  private static indexForGlyph(glyph: Glyph): number {
    return this.objTypes.findIndex(obj => obj.glyph == glyph);
  }

  /**
   * Adds an object of a specified type to the map at a given position.
   * @param {WorldPoint} wp - The position to add the object.
   * @param {GameMapType} map - The map to add the object to.
   * @param {RandomGenerator} rand - The random generator to use for randomness.
   * @param {Glyph} objType - The glyph representing the object type.
   * @param {number} level - The level of the object.
   * @returns {ItemObject} The added object.
   */
  private static addObjTypeToMap(
    wp: WorldPoint,
    map: GameMapType,
    rand: RandomGenerator,
    objType: Glyph,
    level: number,
  ): ItemObject {
    const index = this.indexForGlyph(objType);
    const template: ObjectTypes = ItemObjectManager.getTemplate(index);
    const object = this.makeTemplateObject(level, rand, template);
    map.addObject(object, wp);
    return object;
  }

  /**
   * Adds a random object of a specified level to the map at a given position.
   * @param {WorldPoint} wp - The position to add the object.
   * @param {GameMapType} map - The map to add the object to.
   * @param {RandomGenerator} rand - The random generator to use for randomness.
   * @param {number} level - The level of the object.
   * @returns {ItemObject} The added object.
   */
  static addRandomObjectForLevel(
    wp: WorldPoint,
    map: GameMapType,
    rand: RandomGenerator,
    level: number,
  ): ItemObject {
    const object = this.randomLevelObject(level, rand);
    map.addObject(object, wp);
    return object;
  }

  /**
   * Generates a random object of a specified level.
   * @param {number} level - The level of the object.
   * @param {RandomGenerator} rand - The random generator to use for randomness.
   * @returns {ItemObject} The generated object.
   */
  public static randomLevelObject(
    level: number,
    rand: RandomGenerator,
  ): ItemObject {
    return this.rareRunes(rand, level);
  }

  /**
   * Returns a random object template from the objTypes array.
   *
   * @param {RandomGenerator} rand - The random number generator used to generate a random index.
   * @return {ObjectTypes} The randomly selected object template.
   */
  private static getRandomTemplate(rand: RandomGenerator): ObjectTypes {
    const index = rand.randomInteger(ItemObjectManager.objTypes.length);
    const template: ObjectTypes = ItemObjectManager.getTemplate(index);
    return template;
  }

  /**
   * Generates a rare rune item object with a specified level.
   *
   * @param {RandomGenerator} rand - The random number generator used for randomness.
   * @param {number} level - The level of the item object.
   * @return {ItemObject} The generated rare rune item object.
   */
  private static rareRunes(rand: RandomGenerator, level: number): ItemObject {
    const maxAttempts = 1000;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const template = this.getRandomTemplate(rand);

      if (template.glyph == Glyph.Rune) {
        if (!rand.determineSuccess(level * 3)) {
          attempts++;
          continue;
        }
      }

      return this.makeTemplateObject(level, rand, template);
    }

    throw new Error('Exceeded maximum attempts to find a suitable template.');
  }

  /**
   * Creates an object based on a template.
   * @param {number} level - The level of the object.
   * @param {RandomGenerator} rand - The random generator to use for randomness.
   * @param {ObjectTypes} template - The template for the object.
   * @returns {ItemObject} The created object.
   */
  private static makeTemplateObject(
    level: number,
    rand: RandomGenerator,
    template: ObjectTypes,
  ): ItemObject {
    const objectLevel = rand.adjustLevel(level);
    const object = new ItemObject(
      template.glyph,
      template.slot,
      template.category,
    );
    object.level = objectLevel;

    switch (object.glyph) {
      case Glyph.Potion:
        this.setSpecificSpell(object, Spell.Heal);
        break;
      case Glyph.Rune:
        this.setItemSpell(object, rand);
        this.setCharges(object, 1, rand, level);
        break;
      case Glyph.Scroll:
        this.setItemSpell(object, rand);
        break;
      case Glyph.Pistol:
        this.setSpecificSpell(object, Spell.Bullet);
        object.charges = rand.randomInteger(10, level);
        break;
    }

    return object;
  }

  /**
   * Sets the spell property of the given ItemObject based on its level using the random generator.
   *
   * @param {ItemObject} object - The ItemObject to set the spell property for.
   * @param {RandomGenerator} rand - The random number generator used to determine the spell.
   * @return {void} This function does not return a value.
   */
  private static setItemSpell(object: ItemObject, rand: RandomGenerator): void {
    const l = rand.adjustLevel(object.level);
    object.spell = this.spellForLevel(l);
  }

  /**
   * Returns a Spell based on the given level. Only spells matching the dungeon level or lower will be returned.
   *
   * @param {number} level - The level to determine the Spell.
   * @return {Spell} The Spell corresponding to the given level.
   */
  private static spellForLevel(level: number): Spell {
    const slot: Spell = level % this.highestSpellTier;
    return slot;
  }

  /**
   * Sets the specific spell for the given ItemObject.
   *
   * @param {ItemObject} object - The ItemObject to set the spell for.
   * @param {Spell} spell - The specific spell to set.
   * @return {void} This function does not return a value.
   */
  private static setSpecificSpell(object: ItemObject, spell: Spell): void {
    object.spell = spell;
  }

  /**
   * Sets the charges of an ItemObject using a random integer within a specified range.
   *
   * @param {ItemObject} object - The ItemObject to set the charges for.
   * @param {number} charges - The maximum number of charges.
   * @param {RandomGenerator} rand - The random number generator used to generate a random integer.
   * @param {number} level - The level used to adjust the maximum number of charges.
   * @return {void} This function does not return a value.
   */
  static setCharges(
    object: ItemObject,
    charges: number,
    rand: RandomGenerator,
    level: number,
  ): void {
    object.charges = rand.randomInteger(charges, level);
  }
  /**
   * Retrieves a template object type based on its index.
   * @param {number} index - The index of the template.
   * @returns {ObjectTypes} The template object type.
   * @throws {string} Throws an error if the index is out of bounds.
   */
  private static getTemplate(index: number): ObjectTypes {
    const length = ItemObjectManager.objTypes.length;

    if (index < 0 || index >= length) {
      throw `index ${index} is out of bounds`;
    }
    return ItemObjectManager.objTypes[index];
  }

  /**
   * Retrieves the description of a spell based on its category.
   *
   * @param {Spell} spell - The spell to retrieve the description for.
   * @return {string} The description of the spell, or 'no description' if not found.
   */
  public static getSpellDescription(spell: Spell): string {
    let description: string = 'no description';

    const spellInfo = spellData.spells.find(slot => slot.name === Spell[spell]);
    description = spellInfo?.desc || description;

    return description;
  }
}
