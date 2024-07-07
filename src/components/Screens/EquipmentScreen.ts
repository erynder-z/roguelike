import { BaseScreen } from './BaseScreen';
import { Equipment } from '../Inventory/Equipment';
import { GameState } from '../Builder/Types/GameState';
import { ScreenMaker } from './Types/ScreenMaker';
import { Slot } from '../ItemObjects/Slot';
import { Stack } from '../Terminal/Types/Stack';
import { UnequipCommand } from '../Commands/UnequipCommand';

/**
 * Represents a screen displaying the player's equipment.
 */
export class EquipmentScreen extends BaseScreen {
  public name = 'equipment-screen';
  constructor(
    public game: GameState,
    public make: ScreenMaker,
    public equipment: Equipment = <Equipment>game.equipment,
  ) {
    super(game, make);
  }

  /**
   * Converts slot position to corresponding character.
   * @param {Slot} pos - The slot position.
   * @returns {string} The character representing the slot.
   */
  private slotToCharacter(pos: Slot): string {
    return String.fromCharCode(65 + (pos - Slot.MainHand));
  }

  /**
   * Converts character to corresponding slot position.
   * @param {string} char - The character representing the slot.
   * @returns {Slot} The slot position.
   */
  private CharacterToSlot(char: string): Slot {
    const i: number = char.charCodeAt(0) - 'a'.charCodeAt(0) + Slot.MainHand;
    return i in Slot ? (i as Slot) : Slot.NotWorn;
  }

  /**
   * Draws the equipment screen.
   */
  public drawScreen(): void {
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
    equipmentScreen.classList.add('equipment-screen', 'fade-in');

    const fragment = document.createDocumentFragment();
    const titleElement = this.createTitleElement();
    const equipmentListElement = this.createEquipmentList();

    fragment.appendChild(titleElement);
    fragment.appendChild(equipmentListElement);
    equipmentScreen.appendChild(fragment);

    return equipmentScreen;
  }

  /**
   * Fades out the equipment screen by adding the 'fade-out' class to the element with the ID 'equipment-screen'.
   *
   * @return {void} This function does not return anything.
   */
  private fadeOutEquipmentScreen(): void {
    const inventoryScreenElement = document.getElementById('equipment-screen');
    if (inventoryScreenElement)
      inventoryScreenElement.classList.add('fade-out');
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
   * Creates an HTML heading element with the text content 'Inventory:'.
   *
   * @return {HTMLHeadingElement} The created HTML heading element.
   */
  private createTitleElement(): HTMLHeadingElement {
    const titleElement = document.createElement('h1');
    titleElement.textContent = 'Equipped items: (press u to close.)';
    return titleElement;
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
    return String.fromCharCode(97 + (slot - Slot.MainHand));
  }

  /**
   * Handles the key down event.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack object.
   * @returns {boolean} - True if the event was handled successfully, otherwise false.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    const slot = this.CharacterToSlot(event.key);

    if (event.key === 'u' || this.unequip(slot)) {
      this.fadeOutEquipmentScreen();
      stack.pop();
      return true;
    }
    return false;
  }

  /**
   * Unequips an item from a slot.
   * @param {Slot} slot - The slot from which to unequip the item.
   * @returns {boolean} Whether the unequip action was successful.
   */
  private unequip(slot: Slot): boolean {
    return new UnequipCommand(slot, this.game).turn();
  }
}
