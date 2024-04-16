import { GameIF } from '../Builder/Interfaces/Game';
import { EquipCommand } from '../Commands/EquipCommand';
import { Inventory } from '../Inventory/Inventory';
import { ItemObject } from '../ItemObjects/ItemObject';
import { DrawMap } from '../MapModel/DrawMap';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from './BaseScreen';
import { ScreenMaker } from './Interfaces/ScreenMaker';

/**
 * Represents a screen for interacting with items.
 */
export class ItemScreen extends BaseScreen {
  name: string = 'ItemScreen';
  isEquipped: boolean;

  /**
   * Constructs an instance of ItemScreen.
   * @param {ItemObject} obj - The item object.
   * @param {number} index - The index of the item in the inventory.
   * @param {GameIF} game - The game interface.
   * @param {ScreenMaker} maker - The screen maker interface.
   */
  constructor(
    public obj: ItemObject,
    public index: number,
    game: GameIF,
    maker: ScreenMaker,
  ) {
    super(game, maker);
    this.isEquipped = !!game.equipment;
  }

  /**
   * Draws the item screen.
   * @param {DrawableTerminal} term - The terminal to draw on.
   */
  drawScreen(term: DrawableTerminal): void {
    super.drawScreen(term);
    const fg = 'lightBlue';
    const bg = '#025';

    let y = 1;

    term.drawText(0, y++, `Do what with ${this.obj.description()}?`, fg, bg);
    term.drawText(0, y++, `u use`, fg, bg);
    term.drawText(0, y++, `d drop`, fg, bg);
    term.drawText(0, y++, `t throw`, fg, bg);
    term.drawText(0, y++, `w wear`, fg, bg);

    DrawMap.renderMessage(term, this.game);
  }

  /**
   * Handles key down events.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack interface.
   * @returns {boolean} True if the event was handled, otherwise false.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    console.log('key: ', event.key);

    switch (event.key) {
      case 'd':
        this.dropItem(stack);
        break;
      case 'w':
        this.canWear(stack);
        break;
      default:
        stack.pop();
    }
    return true;
  }

  /**
   * Drops the item from the inventory.
   * @param {Stack} stack - The stack interface.
   */
  dropItem(stack: Stack): void {
    if (this.dropInventoryItem()) this.pop_and_runNPCLoop(stack);
  }

  /**
   * Drops the item from the inventory.
   * @returns {boolean} True if the item was dropped successfully, otherwise false.
   */
  dropInventoryItem(): boolean {
    const game = this.game;
    const map = <MapIF>this.game.currentMap();
    const player = game.player;
    const c = map.cell(player.pos);
    if (c.hasObject()) {
      game.flash('No room to drop here!');
      return false;
    }
    c.obj = this.obj;

    const inventory = <Inventory>game.inventory;
    inventory.removeIndex(this.index);
    game.message(`Dropped ${this.obj.description()}.`);
    return true;
  }

  canWear(stack: Stack): boolean {
    if (!this.isEquipped) return false;

    const ok = new EquipCommand(this.obj, this.index, this.game).turn();
    if (ok) this.pop_and_runNPCLoop(stack);
    return ok;
  }
}
