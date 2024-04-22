import { GameIF } from '../Builder/Interfaces/Game';
import { Inventory } from '../Inventory/Inventory';
import { ItemObject } from '../ItemObjects/ItemObject';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from './BaseScreen';
import { ScreenMaker } from './Interfaces/ScreenMaker';
import { ItemScreen } from './ItemScreen';

/**
 * Represents an inventory screen.
 */
export class InventoryScreen extends BaseScreen {
  name: string = 'inventory-screen';
  inventory: Inventory;

  /**
   * Constructs an instance of InventoryScreen.
   * @param {GameIF} game - The game interface.
   * @param {ScreenMaker} make - Screen maker interface.
   */
  constructor(game: GameIF, make: ScreenMaker) {
    super(game, make);
    this.inventory = <Inventory>game.inventory;
  }

  /**
   * Converts position to character.
   * @param {number} pos - The position to convert.
   * @returns {string} The corresponding character.
   */
  positionToCharacter(pos: number): string {
    return String.fromCharCode(65 + pos);
  }

  /**
   * Converts character to position.
   * @param {string} c - The character to convert.
   * @returns {number} The corresponding position.
   */
  characterToPosition(c: string): number {
    let pos = c.charCodeAt(0) - 'a'.charCodeAt(0);
    if (pos < 0 || pos >= this.inventory.length()) {
      pos = -1;
    }
    return pos;
  }

  /**
   * Draws the inventory screen.
   */
  drawScreen() {
    const existingLogScreen = document.getElementById('inventory-screen');
    if (existingLogScreen) {
      return;
    }
    const invScreen = document.createElement('div');
    invScreen.id = 'inventory-screen';
    invScreen.classList.add(
      'inventory-screen',
      'animate__animated',
      'animate__fadeIn',
      'animate__faster',
    );

    const h1Element = document.createElement('h1');
    h1Element.innerText = 'Inventory:';
    invScreen.appendChild(h1Element);

    const olElement = document.createElement('ul');
    invScreen.appendChild(olElement);

    const inventoryItems = this.inventory.items;
    inventoryItems.forEach(item => {
      const listItem = document.createElement('li');

      const c = this.positionToCharacter(inventoryItems.indexOf(item));
      listItem.textContent = `${c}: ${item.description()}`;
      olElement.appendChild(listItem);
    });

    const canvasContainer = document.getElementById('canvas-container');
    canvasContainer?.appendChild(invScreen);
  }

  /**
   * Handles key down events.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack interface.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): void {
    const pos = this.characterToPosition(event.key);
    if (pos >= 0) {
      this.itemMenu(pos, stack);
    } else {
      if (event.key === 'i') {
        stack.pop();
      }
    }
  }

  /**
   * Opens the item menu.
   * @param {number} pos - The position of the item.
   * @param {Stack} stack - The stack interface.
   */
  itemMenu(pos: number, stack: Stack): void {
    const item: ItemObject = this.inventory.items[pos];
    stack.pop();
    stack.push(new ItemScreen(item, pos, this.game, this.make));
  }
}
