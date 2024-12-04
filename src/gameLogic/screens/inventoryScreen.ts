import { BaseScreen } from './baseScreen';
import { GameState } from '../../types/gameBuilder/gameState';
import { Inventory } from '../inventory/inventory';
import { InventoryScreenDisplay } from '../../ui/inventoryScreenDisplay/inventoryScreenDisplay';
import { ItemScreen } from './itemScreen';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';

/**
 * Represents an inventory screen.
 */
export class InventoryScreen extends BaseScreen {
  public name = 'inventory-screen';
  private display: InventoryScreenDisplay | null = null;
  constructor(
    public game: GameState,
    public make: ScreenMaker,
    private inventory: Inventory = <Inventory>game.inventory,
  ) {
    super(game, make);
  }

  /**
   * Renders the inventory screen via a custom component.
   */
  public drawScreen(): void {
    const container = document.getElementById('canvas-container');
    if (!this.display) {
      this.display = document.createElement(
        'inventory-screen-display',
      ) as InventoryScreenDisplay;
      container?.appendChild(this.display);

      this.display.items = this.inventory.items;
      this.display.menuKeyText = this.activeControlScheme.menu.toString();
    }
  }

  /**
   * Fades out the inventory screen.
   * @returns {Promise<void>}
   */
  private async fadeOutInventoryScreen(): Promise<void> {
    if (this.display) {
      await this.display.fadeOut();
      this.display.remove();
    }
  }

  /**
   * Handles key down events.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    const pos = this.characterToPosition(event.key);
    if (pos >= 0) {
      this.fadeOutInventoryScreen();
      this.itemMenu(pos, stack);
    } else if (event.key === this.activeControlScheme.menu.toString()) {
      this.fadeOutInventoryScreen();
      stack.pop();
      return true;
    }
    return false;
  }

  /**
   * Converts character to position.
   */
  private characterToPosition(c: string): number {
    const pos = c.charCodeAt(0) - 'a'.charCodeAt(0);
    return pos >= 0 && pos < this.inventory.length() ? pos : -1;
  }

  /**
   * Opens the item menu.
   */
  private itemMenu(pos: number, stack: Stack): void {
    const item = this.inventory.items[pos];
    stack.pop();
    stack.push(new ItemScreen(item, pos, this.game, this.make));
  }
}
