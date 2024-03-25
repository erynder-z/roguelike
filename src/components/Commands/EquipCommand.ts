import { GameIF } from '../Builder/Interfaces/Game';
import { Equipment } from '../Inventory/Equipment';
import { ItemObject } from '../ItemObjects/ItemObject';
import { Slot } from '../ItemObjects/Slot';
import { CommandBase } from './CommandBase';

/**
 * Represents a command to equip an item in a game.
 */
export class EquipCommand extends CommandBase {
  equipment: Equipment;

  /**
   * Creates an instance of EquipCommand.
   * @param {ItemObject} item The item to equip.
   * @param {number} index The index of the item in the inventory.
   * @param {GameIF} game The game interface.
   */
  constructor(
    public item: ItemObject,
    public index: number,
    public game: GameIF,
  ) {
    super(game.player, game);
    this.equipment = <Equipment>game.equipment;
  }

  /**
   * Executes the equip command.
   * @returns {boolean} True if the command executed successfully, false otherwise.
   */
  execute(): boolean {
    const game = this.game;
    const item = this.item;
    if (!this.isEquippable(item)) return false;
    if (this.isAlreadyEquipped(item)) return false;
    if (this.areHandsFull(item)) return false;

    game.inventory!.removeIndex(this.index);
    this.equipment.add(item);
    this.game.message(`${item.description()} is now equipped.`);
    return true;
  }

  /**
   * Checks if an item is equippable.
   * @param {ItemObject} item The item to check.
   * @returns {boolean} True if the item is equippable, false otherwise.
   */
  isEquippable(item: ItemObject): boolean {
    const canEquip = item.slot != Slot.NotWorn;
    if (!canEquip) this.game.flash(`${item.description()} is not equippable.`);
    return canEquip;
  }

  /**
   * Checks if an item is already equipped.
   * @param {ItemObject} item The item to check.
   * @returns {boolean} True if the item is already equipped, false otherwise.
   */
  isAlreadyEquipped(item: ItemObject): boolean {
    const alreadyEquipped = this.equipment.has(item.slot);
    if (alreadyEquipped) {
      const label = Slot[item.slot];
      this.game.flash(`${label} is already equipped.`);
    }
    return alreadyEquipped;
  }

  /**
   * Checks if the hands are already full with weapons.
   * @param {ItemObject} item The item to check if it's a weapon.
   * @returns {boolean} True if the hands are already full, false otherwise.
   */
  areHandsFull(item: ItemObject): boolean {
    if (!Equipment.isWeapon(item)) return false;
    const equipment = this.equipment;

    const inHand: ItemObject | undefined = equipment.weapon();
    if (!inHand) return false;
    const overlap = this.doesOverlap(item.slot, inHand!.slot);
    if (overlap) {
      this.game.flash(`Must first unequip${inHand!.name()}!`);
    }
    return true;
  }

  /**
   * Checks if two slots overlap.
   * @param {Slot} slot The first slot to check.
   * @param {Slot} hand The second slot to check.
   * @returns {boolean} True if the slots overlap, false otherwise.
   */
  doesOverlap(slot: Slot, hand: Slot): boolean {
    return slot == Slot.BothHands || hand == Slot.BothHands || hand == slot;
  }
}