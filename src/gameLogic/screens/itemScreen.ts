import { BaseScreen } from './baseScreen';
import { Command } from '../../types/gameLogic/commands/command';
import { CommandBase } from '../commands/commandBase';
import { EntityInfoCard } from '../../ui/entityInfoDisplay/entityInfoCard';
import { EquipCommand } from '../commands/equipCommand';
import { EventCategory, LogMessage } from '../messages/logMessage';
import { DetailViewHandler } from '../../utilities/detailViewHandler';
import { FindObjectSpell } from '../spells/findObjectSpells';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { GameState } from '../../types/gameBuilder/gameState';
import { Inventory } from '../inventory/inventory';
import { ItemObject } from '../itemObjects/itemObject';
import { ItemScreenDisplay } from '../../ui/itemScreenDisplay/itemScreenDisplay';
import { ObjCategory } from '../itemObjects/itemCategories';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { StackScreen } from '../../types/terminal/stackScreen';

/**
 * Represents a screen for interacting with items.
 */
export class ItemScreen extends BaseScreen {
  public name = 'item-screen';

  private display: ItemScreenDisplay | null = null;

  constructor(
    private obj: ItemObject,
    private index: number,
    public game: GameState,
    public maker: ScreenMaker,
    private isEquipped: boolean = !!game.equipment,
  ) {
    super(game, maker);
  }

  /**
   * Draws the item screen by creating and appending an 'item-screen-display' element
   * to the 'canvas-container' element.
   */
  public drawScreen(): void {
    const container = document.getElementById('canvas-container');
    if (!this.display) {
      this.display = document.createElement(
        'item-screen-display',
      ) as ItemScreenDisplay;

      this.display.itemDescription = this.obj.description();

      this.display.options = [
        { key: 'v', description: 'View' },
        { key: 'd', description: 'Drop' },
      ];

      if (this.obj.category.includes(ObjCategory.Armor))
        this.display.options.push({ key: 'w', description: 'Wear' });

      if (this.obj.category.includes(ObjCategory.MeleeWeapon))
        this.display.options.push({ key: 'q', description: 'Equip' });

      if (this.obj.category.includes(ObjCategory.RangedWeapon))
        this.display.options.push({ key: 'f', description: 'Fire' });

      if (this.obj.category.includes(ObjCategory.SpellItem))
        this.display.options.push({ key: 'c', description: 'Cast' });

      if (this.obj.category.includes(ObjCategory.Consumable))
        this.display.options.push({ key: 'u', description: 'Use' });

      this.display.menuKeyText = this.activeControlScheme.menu.toString();

      container?.appendChild(this.display);
    }
  }

  /**
   * Creates and appends an 'entity-info-card' element to the 'canvas-container' element, containing
   * detailed information about the given item object.
   * @param {ItemObject} obj - The item object to display.
   */
  private displayItemDetails(obj: ItemObject): void {
    const canvasContainer = document.getElementById('canvas-container');
    const entityCard = document.createElement(
      'entity-info-card',
    ) as EntityInfoCard;

    const detailViewHandler = new DetailViewHandler();
    const entity = detailViewHandler.transformIntoDetailViewEntity(obj);

    if (canvasContainer) canvasContainer.appendChild(entityCard);
    entityCard.id = 'entity-info-card';
    entityCard.fillCardDetails(entity);
  }

  /**
   * Handles key down events on the item screen.
   *
   * @param {KeyboardEvent} event - The keyboard event triggered by the user.
   * @param {Stack} stack - The stack of screens in the application.
   * @returns {boolean} - True if the event is handled and causes a screen transition, otherwise false.
   * This function maps specific key presses to actions that can be performed on the item screen,
   * such as dropping, wearing, equipping, using, firing, casting, or viewing details of an item.
   * If the menu key is pressed, the current screen is removed from the stack. When a valid item
   * action key is pressed, the corresponding action is executed, and the item screen fades out.
   */

  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    const { display, activeControlScheme } = this;

    // Get the keys that are currently shown on the item screen
    const optionKeys = display?.options.map(option => option.key);

    // Map the keys to actions
    const itemActions: Record<string, (stack: Stack) => void> = {
      // Drop the item
      d: () => this.dropItem(stack),
      // Wear the item
      w: () => this.canWear(stack),
      // Equip the item
      q: () => this.canWear(stack),
      // Use the item
      u: () => this.useItem(stack),
      // Fire the item
      f: () => this.useItem(stack),
      // Cast the item
      c: () => this.useItem(stack),
      // View the item's details
      v: () => {
        this.displayItemDetails(this.obj);
        stack.pop();
        this.fadeOutItemScreen();
      },
    };

    // If the menu key is pressed, pop the stack and fade out the item screen
    if (event.key === activeControlScheme.menu.toString()) {
      stack.pop();
      this.fadeOutItemScreen();
      return true;
    }

    // If the key is in the list of keys shown on the item screen and there is an action associated with it,
    // perform the action and fade out the item screen
    if (optionKeys?.includes(event.key) && itemActions[event.key]) {
      itemActions[event.key](stack);
      this.fadeOutItemScreen();
      return true;
    }

    return false;
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
   * Wears an item from the inventory.
   * @param {Stack} stack - The stack to pop if the item can't be equipped.
   * @returns {boolean} True if the item was successfully equipped, otherwise false.
   */
  private canWear(stack: Stack): boolean {
    if (!this.isEquipped) return false;

    const ok = new EquipCommand(this.obj, this.index, this.game).turn();
    if (ok) {
      this.pop_and_runNPCLoop(stack);
    } else {
      stack.pop();
    }
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

  /**
   * Fades out the item screen display and removes it from the DOM.
   *
   * @returns {Promise<void>} A promise that resolves when the fade out animation ends.
   */
  private async fadeOutItemScreen(): Promise<void> {
    if (this.display) {
      await this.display.fadeOut();
      this.display.remove();
    }
  }
}
