import { GameIF } from '../Builder/Interfaces/Game';
import { UnequipCommand } from '../Commands/UnequipCommand';
import { Equipment } from '../Inventory/Equipment';
import { Slot } from '../ItemObjects/Slot';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from './BaseScreen';
import { ScreenMaker } from './Interfaces/ScreenMaker';

/**
 * Represents a screen displaying the player's equipment.
 */
export class EquipmentScreen extends BaseScreen {
  name: string = 'equipment-screen';
  equipment: Equipment;

  /**
   * Creates an instance of EquipmentScreen.
   * @param {GameIF} game - The game interface object.
   * @param {ScreenMaker} make - The screen maker interface object.
   */
  constructor(game: GameIF, make: ScreenMaker) {
    super(game, make);
    this.equipment = <Equipment>game.equipment;
  }

  /**
   * Converts slot position to corresponding character.
   * @param {Slot} pos - The slot position.
   * @returns {string} The character representing the slot.
   */
  slotToCharacter(pos: Slot): string {
    return String.fromCharCode(65 + (pos - Slot.MainHand));
  }

  /**
   * Converts character to corresponding slot position.
   * @param {string} char - The character representing the slot.
   * @returns {Slot} The slot position.
   */
  CharacterToSlot(char: string): Slot {
    const i: number = char.charCodeAt(0) - 'a'.charCodeAt(0) + Slot.MainHand;
    return i in Slot ? (i as Slot) : Slot.NotWorn;
  }

  /**
   * Draws the equipment screen.
   */
  drawScreen(): void {
    const existingEquipmentScreen = document.getElementById('equipment-screen');
    if (existingEquipmentScreen) {
      return;
    }
    const equipmentScreen = this.createEquipmentScreen();
    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer?.appendChild(equipmentScreen);
  }

  private createEquipmentScreen(): HTMLDivElement {
    const equipmentScreen = document.createElement('div');
    equipmentScreen.id = 'equipment-screen';
    equipmentScreen.classList.add(
      'equipment-screen',
      'animate__animated',
      'animate__fadeIn',
      'animate__faster',
    );

    equipmentScreen.appendChild(this.createEquipmentList());

    return equipmentScreen;
  }

  /**
   * Creates an HTML unordered list element containing a list of equipment items.
   *
   * @return {HTMLUListElement} The created equipment list element.
   */
  private createEquipmentList(): HTMLUListElement {
    const equipmentList = document.createElement('ul');

    for (let slot = Slot.MainHand; slot < Slot.Last; ++slot) {
      const itemDescription = this.getItemDescription(slot);
      const listItem = this.createListItem(slot, itemDescription);
      equipmentList.appendChild(listItem);
    }

    return equipmentList;
  }

  /**
   * Retrieves the description of the item in the specified slot.
   *
   * @param {Slot} slot - The slot to retrieve the item from.
   * @return {string} The description of the item, or 'none' if the slot is empty.
   */
  private getItemDescription(slot: Slot): string {
    const item = this.equipment.get(slot);
    return item ? item.description() : 'none';
  }

  /**
   * Creates a list item element with the given slot and item description.
   *
   * @param {Slot} slot - The slot to get the character for.
   * @param {string} itemDescription - The description of the item.
   * @return {HTMLLIElement} The created list item element.
   */
  private createListItem(slot: Slot, itemDescription: string): HTMLLIElement {
    const listItem = document.createElement('li');
    listItem.textContent = `${this.getStringCharacter(slot)} - ${Slot[slot]}: ${itemDescription}`;
    return listItem;
  }

  /**
   * Returns the character corresponding to the given slot.
   *
   * @param {Slot} slot - The slot to get the character for.
   * @return {string} The character corresponding to the given slot.
   */
  private getStringCharacter(slot: Slot): string {
    return String.fromCharCode(65 + (slot - Slot.MainHand));
  }

  /**
   * Handles the key down event.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack object.
   * @returns {boolean} Whether the event was handled.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    const slot = this.CharacterToSlot(event.key);

    if (event.key === 'u' || this.unequip(slot)) stack.pop();
    return true;
  }

  /**
   * Unequips an item from a slot.
   * @param {Slot} slot - The slot from which to unequip the item.
   * @returns {boolean} Whether the unequip action was successful.
   */
  unequip(slot: Slot): boolean {
    return new UnequipCommand(slot, this.game).turn();
  }
}
