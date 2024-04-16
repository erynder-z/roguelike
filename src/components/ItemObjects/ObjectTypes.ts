import { Glyph } from '../Glyphs/Glyph';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { WorldPoint } from '../MapModel/WorldPoint';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { ObjTypesIF } from './Interfaces/ObjTypesIF';
import { ItemObject } from './ItemObject';
import { Slot } from './Slot';

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
  ];

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
    const index = rnd.randomInteger(ObjectTypes.objTypes.length);
    const template: ObjTypesIF = ObjectTypes.getTemplate(index);
    return this.makeTemplateObject(level, rnd, template);
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
    return object;
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
}
