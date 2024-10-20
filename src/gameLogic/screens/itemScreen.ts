import { BaseScreen } from './baseScreen';
import { Command } from '../../types/gameLogic/commands/command';
import { CommandBase } from '../commands/commandBase';
import { DrawableTerminal } from '../../types/terminal/drawableTerminal';
import { DrawUI } from '../../renderer/drawUI';
import { EquipCommand } from '../commands/equipCommand';
import { EventCategory, LogMessage } from '../messages/logMessage';
import { FindObjectSpell } from '../spells/findObjectSpells';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { GameState } from '../../types/gameBuilder/gameState';
import { Inventory } from '../inventory/inventory';
import { ItemObject } from '../itemObjects/itemObject';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { StackScreen } from '../../types/terminal/stackScreen';

/**
 * Represents a screen for interacting with items.
 */
export class ItemScreen extends BaseScreen {
  public name = 'item-screen';
  constructor(
    public obj: ItemObject,
    public index: number,
    public game: GameState,
    public maker: ScreenMaker,
    public isEquipped: boolean = !!game.equipment,
  ) {
    super(game, maker);
  }

  /**
   * Draws the item screen.
   * @param {DrawableTerminal} term - The terminal to draw on.
   */
  public drawScreen(term: DrawableTerminal): void {
    super.drawScreen(term);
    const fg = 'lightBlue';
    const bg = '#025';

    let y = 1;

    term.drawText(0, y++, `Do what with ${this.obj.description()}?`, fg, bg);
    term.drawText(0, y++, `u use`, fg, bg);
    term.drawText(0, y++, `d drop`, fg, bg);
    term.drawText(0, y++, `t throw`, fg, bg);
    term.drawText(0, y++, `w wear`, fg, bg);

    DrawUI.renderMessage(this.game);
  }

  /**
   * Handles key down events.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack interface.
   * @returns {boolean} True if the event was handled, otherwise false.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    console.log('key: ', event.key);

    switch (event.key) {
      case 'd':
        this.dropItem(stack);
        break;
      case 'w':
        this.canWear(stack);
        break;
      case 'u':
        this.useItem(stack);
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
  private dropItem(stack: Stack): void {
    if (this.dropInventoryItem()) this.pop_and_runNPCLoop(stack);
  }

  /**
   * Drops the item from the inventory.
   * @returns {boolean} True if the item was dropped successfully, otherwise false.
   */
  private dropInventoryItem(): boolean {
    const { game } = this;
    const { player } = game;

    const map = <GameMapType>this.game.currentMap();
    const c = map.cell(player.pos);
    if (c.hasObject()) {
      const msg = new LogMessage('No room to drop here!', EventCategory.unable);
      game.flash(msg);
      return false;
    }
    c.obj = this.obj;

    const inventory = <Inventory>game.inventory;
    inventory.removeIndex(this.index);

    const msg = new LogMessage(
      `Dropped ${this.obj.description()}.`,
      EventCategory.drop,
    );
    game.message(msg);

    return true;
  }

  /**
   * Checks if the item can be worn.
   *
   * @param {Stack} stack - The stack of screens.
   * @return {boolean} Returns true if the item can be worn, false otherwise.
   */
  private canWear(stack: Stack): boolean {
    if (!this.isEquipped) return false;

    const ok = new EquipCommand(this.obj, this.index, this.game).turn();
    if (ok) this.pop_and_runNPCLoop(stack);
    return ok;
  }

  /**
   * Uses an item by finding the matching item/spell and executing it.
   *
   * @param {Stack} stack - The stack to push the spell screen onto if necessary.
   * @return {void} This function does not return anything.
   */
  private useItem(stack: Stack): void {
    const { game } = this;

    const finder = new FindObjectSpell(
      this.obj,
      this.index,
      game,
      stack,
      this.make,
    );
    const spell: Command | StackScreen | null = finder.find();

    if (spell == null) return;
    stack.pop();

    if (spell instanceof CommandBase) {
      // If the spell is a command, execute it.
      if (spell.turn()) this.npcTurns(stack);
    } else {
      // Otherwise, if the spell is a screen, push the screen onto the stack.
      stack.push(<StackScreen>spell);
    }
  }
}
