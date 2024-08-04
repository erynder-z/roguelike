import { CommandBase } from './CommandBase';
import { Equipment } from '../Inventory/Equipment';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { ItemObject } from '../ItemObjects/ItemObject';
import { LogMessage } from '../Messages/LogMessage';
import { Slot } from '../ItemObjects/Slot';

/**
 * Represents a command to equip an item in a game.
 */
export class EquipCommand extends CommandBase {
  constructor(
    public item: ItemObject,
    public index: number,
    public game: GameState,
    public equipment: Equipment = <Equipment>game.equipment,
  ) {
    super(game.player, game);
  }

  /**
   * Executes the equip command.
   * @returns {boolean} True if the command executed successfully, false otherwise.
   */
  public execute(): boolean {
    const { game, item, index, equipment } = this;
    const { inventory } = game;

    if (!this.isEquippable(item)) return false;
    if (this.isAlreadyEquipped(item)) return false;
    if (this.areHandsFull(item)) return false;

    inventory!.removeIndex(index);
    equipment.add(item);
    const msg = new LogMessage(
      "You've equipped " + item.description() + '.',
      EventCategory.equip,
    );
    game.message(msg);
    return true;
  }

  /**
   * Checks if an item is equippable.
   * @param {ItemObject} item The item to check.
   * @returns {boolean} True if the item is equippable, false otherwise.
   */
  private isEquippable(item: ItemObject): boolean {
    const canEquip = item.slot != Slot.NotWorn;
    const msg = new LogMessage(
      "You can't equip " + item.description() + '.',
      EventCategory.unable,
    );
    if (!canEquip) this.game.flash(msg);
    return canEquip;
  }

  /**
   * Checks if an item is already equipped.
   * @param {ItemObject} item The item to check.
   * @returns {boolean} True if the item is already equipped, false otherwise.
   */
  private isAlreadyEquipped(item: ItemObject): boolean {
    const { game } = this;

    const alreadyEquipped = this.equipment.has(item.slot);

    if (alreadyEquipped) {
      const label = Slot[item.slot];
      const msg = new LogMessage(
        `${label} is already equipped.`,
        EventCategory.unable,
      );
      game.flash(msg);
    }
    return alreadyEquipped;
  }

  /**
   * Checks if the hands are already full with weapons.
   * @param {ItemObject} item The item to check if it's a weapon.
   * @returns {boolean} True if the hands are already full, false otherwise.
   */
  private areHandsFull(item: ItemObject): boolean {
    if (!Equipment.isWeapon(item)) return false;
    const { game, equipment } = this;

    const inHand: ItemObject | undefined = equipment.weapon();

    if (!inHand) return false;
    const overlap = this.doesOverlap(item.slot, inHand!.slot);
    if (overlap) {
      const msg = new LogMessage(
        `Must first unequip${inHand!.name()}!`,
        EventCategory.unable,
      );
      game.flash(msg);
    }
    return overlap;
  }

  /**
   * Checks if two slots overlap.
   * @param {Slot} slot The first slot to check.
   * @param {Slot} hand The second slot to check.
   * @returns {boolean} True if the slots overlap, false otherwise.
   */
  private doesOverlap(slot: Slot, hand: Slot): boolean {
    return slot == Slot.BothHands || hand == Slot.BothHands || hand == slot;
  }
}
