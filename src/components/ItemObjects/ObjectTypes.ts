import { Glyph } from '../Glyphs/Glyph';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Spell } from '../Spells/Spell';
import { ObjTypesIF } from './Interfaces/ObjTypesIF';
import { ItemObject } from './ItemObject';
import { Slot } from './Slot';
import * as spellData from '../Spells/SpellData/spells.json';

/**
 * Represents a collection of objects (items) in the game world.
 */
export class ObjectTypes {
  static objTypes: ObjTypesIF[] = [
    { g: Glyph.Dagger, s: Slot.MainHand },
    { g: Glyph.Shield, s: Slot.OffHand },
    { g: Glyph.Cap, s: Slot.Head },
    { g: Glyph.Gloves, s: Slot.Hands },
    { g: Glyph.Cape, s: Slot.Back },
    { g: Glyph.Pants, s: Slot.Legs },
    { g: Glyph.Boots, s: Slot.Feet },
    { g: Glyph.Potion, s: Slot.NotWorn },
    { g: Glyph.Rune, s: Slot.NotWorn },
    { g: Glyph.Scroll, s: Slot.NotWorn },
    { g: Glyph.Pistol, s: Slot.NotWorn },
  ];

  static highestSpellTier: number = Spell.None;

  /**
   * Retrieves the index of an object type based on its glyph.
   * @param {Glyph} g - The glyph of the object type.
   * @returns {number} The index of the object type.
   */
  static indexForGlyph(g: Glyph): number {
    return this.objTypes.findIndex(obj => obj.g == g);
  }

  /**
   * Adds an object of a specified type to the map at a given position.
   * @param {WorldPoint} p - The position to add the object.
   * @param {MapIF} map - The map to add the object to.
   * @param {RandomGenerator} rnd - The random generator to use for randomness.
   * @param {Glyph} objType - The glyph representing the object type.
   * @param {number} level - The level of the object.
   * @returns {ItemObject} The added object.
   */
  static addObjTypeToMap(
    p: WorldPoint,
    map: MapIF,
    rnd: RandomGenerator,
    objType: Glyph,
    level: number,
  ): ItemObject {
    const index = this.indexForGlyph(objType);
    const template: ObjTypesIF = ObjectTypes.getTemplate(index);
    const object = this.makeTemplateObject(level, rnd, template);
    map.addObject(object, p);
    return object;
  }

  /**
   * Adds a random object of a specified level to the map at a given position.
   * @param {WorldPoint} p - The position to add the object.
   * @param {MapIF} map - The map to add the object to.
   * @param {RandomGenerator} rnd - The random generator to use for randomness.
   * @param {number} level - The level of the object.
   * @returns {ItemObject} The added object.
   */
  static addRandomObjectForLevel(
    p: WorldPoint,
    map: MapIF,
    rnd: RandomGenerator,
    level: number,
  ): ItemObject {
    const object = this.randomLevelObject(level, rnd);
    map.addObject(object, p);
    return object;
  }

  /**
   * Generates a random object of a specified level.
   * @param {number} level - The level of the object.
   * @param {RandomGenerator} rnd - The random generator to use for randomness.
   * @returns {ItemObject} The generated object.
   */
  static randomLevelObject(level: number, rnd: RandomGenerator): ItemObject {
    return this.rareRunes(rnd, level);
  }

  /**
   * Returns a random object template from the objTypes array.
   *
   * @param {RandomGenerator} rnd - The random number generator used to generate a random index.
   * @return {ObjTypesIF} The randomly selected object template.
   */
  static getRandomTemplate(rnd: RandomGenerator): ObjTypesIF {
    const index = rnd.randomInteger(ObjectTypes.objTypes.length);
    const template: ObjTypesIF = ObjectTypes.getTemplate(index);
    return template;
  }

  /**
   * Generates a rare rune item object with a specified level.
   *
   * @param {RandomGenerator} rnd - The random number generator used for randomness.
   * @param {number} level - The level of the item object.
   * @return {ItemObject} The generated rare rune item object.
   */
  static rareRunes(rnd: RandomGenerator, level: number): ItemObject {
    const maxAttempts = 1000;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const template = this.getRandomTemplate(rnd);

      if (template.g == Glyph.Rune) {
        if (!rnd.determineSuccess(level * 3)) {
          attempts++;
          continue;
        }
      }

      return this.makeTemplateObject(level, rnd, template);
    }

    throw new Error('Exceeded maximum attempts to find a suitable template.');
  }

  /**
   * Creates an object based on a template.
   * @param {number} level - The level of the object.
   * @param {RandomGenerator} rnd - The random generator to use for randomness.
   * @param {ObjTypesIF} template - The template for the object.
   * @returns {ItemObject} The created object.
   */
  static makeTemplateObject(
    level: number,
    rnd: RandomGenerator,
    template: ObjTypesIF,
  ): ItemObject {
    const objectLevel = rnd.adjustLevel(level);
    const object = new ItemObject(template.g, template.s);
    object.level = objectLevel;
    // TODO: Pistols are currently not usable!!!
    if (object.glyph == Glyph.Pistol)
      object.charges = rnd.randomInteger(10 + level);

    if (object.glyph == Glyph.Rune)
      object.charges = rnd.randomInteger(1 + level);

    switch (object.glyph) {
      /*       case Glyph.Potion: */
      case Glyph.Rune:
      case Glyph.Scroll:
        this.setItemSpell(object, rnd);
    }

    return object;
  }

  /**
   * Sets the spell property of the given ItemObject based on its level using the random generator.
   *
   * @param {ItemObject} object - The ItemObject to set the spell property for.
   * @param {RandomGenerator} rnd - The random number generator used to determine the spell.
   * @return {void} This function does not return a value.
   */
  static setItemSpell(object: ItemObject, rnd: RandomGenerator): void {
    const l = rnd.adjustLevel(object.level);
    object.spell = this.spellForLevel(l);
  }

  /**
   * Returns a Spell based on the given level. Only spells matching the dungeon level or lower will be returned.
   *
   * @param {number} level - The level to determine the Spell.
   * @return {Spell} The Spell corresponding to the given level.
   */
  static spellForLevel(level: number): Spell {
    const s: Spell = level % this.highestSpellTier;
    return s;
  }

  /**
   * Retrieves a template object type based on its index.
   * @param {number} index - The index of the template.
   * @returns {ObjTypesIF} The template object type.
   * @throws {string} Throws an error if the index is out of bounds.
   */
  static getTemplate(index: number): ObjTypesIF {
    const length = ObjectTypes.objTypes.length;

    if (index < 0 || index >= length) {
      throw `index ${index} is out of bounds`;
    }
    return ObjectTypes.objTypes[index];
  }

  /**
   * Retrieves the description of a spell based on its category.
   *
   * @param {Spell} spell - The spell to retrieve the description for.
   * @return {string} The description of the spell, or 'no description' if not found.
   */
  static getSpellDescription(spell: Spell): string {
    let description: string = 'no description';

    const spellInfo = spellData.spells.find(s => s.name === Spell[spell]);
    description = spellInfo?.desc || description;

    return description;
  }
}
