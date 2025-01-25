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
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Stack } from '../../types/terminal/stack';
import { StackScreen } from '../../types/terminal/stackScreen';

/**
 * Represents a screen for interacting with items.
 */
export class ItemScreen extends BaseScreen {
  public name = 'item-screen';

  private display: ItemScreenDisplay | null = null;
  private isEntityCardOpen = false;
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
        { key: 'u', description: 'Use' },
        { key: 'd', description: 'Drop' },
        { key: 'w', description: 'Wear' },
      ];
      this.display.menuKeyText = this.activeControlScheme.menu.toString();

      container?.appendChild(this.display);
    }
  }

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

    this.isEntityCardOpen = true;
  }

  /**
   * Handles key down events.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack interface.
   * @returns {boolean} True if the event was handled, otherwise false.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    if (this.isEntityCardOpen) {
      const entityCard = document.getElementById(
        'entity-info-card',
      ) as EntityInfoCard;
      if (entityCard) {
        entityCard.fadeOutAndRemove();
        this.isEntityCardOpen = false;
      }
      // The menu key will pop the stack nevertheless, so it must be excluded.
      if (event.key !== this.activeControlScheme.menu.toString()) stack.pop();
    }

    switch (event.key) {
      case 'v':
        this.displayItemDetails(this.obj);
        break;
      case 'd':
        this.dropItem(stack);
        break;
      case 'w':
        this.canWear(stack);
        break;
      case 'u':
        this.useItem(stack);
        break;
      case this.activeControlScheme.menu.toString():
        stack.pop();
        break;
      default:
        return false;
    }

    this.fadeOutItemScreen();

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
