import { ItemObject } from '../ItemObjects/ItemObject';
import { Slot } from '../ItemObjects/Slot';

/**
 * Represents equippable items
 */
export class Equipment {
  private _objs: Map<Slot, ItemObject> = new Map();

  /**
   * Adds an item to the equipment.
   * @param {ItemObject} o The item to add.
   * @throws {string} Throws an error if the item cannot be legally added.
   */
  public add(o: ItemObject): void {
    this.legalObj(o);
    this._objs.set(o.slot, o);
  }

  /**
   * Removes an item from the equipment by its slot.
   * @param {Slot} s The slot of the item to remove.
   * @throws {string} Throws an error if the slot does not exist.
   */
  public remove(s: Slot): void {
    this.legalSlot(s);
    this._objs.delete(s);
  }

  /**
   * Checks if the equipment has an item in the given slot.
   * @param {Slot} s The slot to check.
   * @returns {boolean} True if the equipment has an item in the slot, false otherwise.
   */
  public has(s: Slot): boolean {
    return this._objs.has(s);
  }

  /**
   * Returns the number of items in the equipment.
   * @returns {number} The number of items.
   */
  public length(): number {
    return this._objs.size;
  }

  /**
   * Retrieves the item in the specified slot.
   * @param {Slot} s The slot to retrieve the item from.
   * @returns {ItemObject | undefined} The item in the slot, or undefined if not found.
   */
  public get(s: Slot): ItemObject | undefined {
    return this._objs.get(s);
  }

  /**
   * Checks if the slot exists in the equipment.
   * @param {Slot} s The slot to check.
   * @throws {string} Throws an error if the slot does not exist.
   */
  private legalSlot(s: Slot): void {
    if (!this.has(s)) {
      console.log(this._objs);
      throw 'Slot does not exist!';
    }
  }

  /**
   * Checks if the item can be legally added to the equipment.
   * @param {ItemObject} o The item to check.
   * @throws {string} Throws an error if the item cannot be legally added.
   */
  private legalObj(o: ItemObject): void {
    const slot: Slot = o.slot;
    if (slot == Slot.NotWorn) {
      console.log(slot, o);
      throw 'Item cannot be worn!';
    }
    if (slot == undefined) {
      console.log(slot, o);
      throw 'Item slot is undefined!';
    }
  }

  /**
   * Calculates the total armor class provided by all equipped items.
   * @returns {number} The total armor class.
   */
  public armorClass(): number {
    let ac: number = 0;
    for (const [, v] of this._objs) {
      ac += v.level * 2;
    }
    return ac;
  }

  /**
   * Calculates the reduction factor for armor class.
   * @returns {number} The reduction factor.
   */
  public armorClass_reduce(): number {
    const ac: number = this.armorClass();
    const reduce = 1.0 * (ac * 0.1 + 1.0);
    return reduce;
  }

  /**
   * Array of slots considered as weapon slots.
   */
  public static weapons: Slot[] = [Slot.MainHand, Slot.OffHand, Slot.BothHands];

  /**
   * Checks if an item is a weapon.
   * @param {ItemObject} o The item to check.
   * @returns {boolean} True if the item is a weapon, false otherwise.
   */
  public static isWeapon(o: ItemObject): boolean {
    return o.slot in Equipment.weapons;
  }

  /**
   * Retrieves the first weapon found in the equipment.
   * @returns {ItemObject | undefined} The first weapon found, or undefined if no weapon is found.
   */
  public weapon(): ItemObject | undefined {
    for (const slot of Equipment.weapons) {
      if (this.has(slot)) return this.get(slot);
    }
    return undefined;
  }

  /**
   * Calculates the damage provided by the equipped weapon.
   * @returns {number} The weapon damage.
   */
  public weaponDamage(): number {
    const weapon: ItemObject | undefined = this.weapon();
    const minDmg: number = 2;
    if (weapon) return weapon.level + 1;
    return minDmg;
  }
}
