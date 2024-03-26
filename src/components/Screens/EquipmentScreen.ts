import { GameIF } from '../Builder/Interfaces/Game';
import { UnequipCommand } from '../Commands/UnequipCommand';
import { Equipment } from '../Inventory/Equipment';
import { ItemObject } from '../ItemObjects/ItemObject';
import { Slot } from '../ItemObjects/Slot';
import { DrawMap } from '../MapModel/DrawMap';
import { DrawableTerminal } from '../Terminal/Interfaces/DrawableTerminal';
import { Stack } from '../Terminal/Interfaces/Stack';
import { BaseScreen } from './BaseScreen';
import { ScreenMaker } from './Interfaces/ScreenMaker';

/**
 * Represents a screen displaying the player's equipment.
 */
export class EquipmentScreen extends BaseScreen {
  name: string = 'EquipmentScreen';
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
   * @param {DrawableTerminal} term - The drawable terminal object.
   */
  drawScreen(term: DrawableTerminal): void {
    let y: number = 1;
    term.drawText(0, y++, `Wearing: `, 'yellow', 'black');
    for (let slot = Slot.MainHand; slot < Slot.Last; ++slot) {
      const c: string = this.slotToCharacter(slot);
      const label: string = Slot[slot];
      const wornItem: ItemObject | undefined = this.equipment.get(slot);
      const item: string = wornItem ? wornItem.description() : '';
      const fg: string = wornItem ? 'yellow' : 'darkGray';

      term.drawText(0, y++, `${c}: ${item} ${label}`, fg, 'black');
    }
    DrawMap.renderMessage(term, this.game);
  }

  /**
   * Handles the key down event.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack object.
   * @returns {boolean} Whether the event was handled.
   */
  handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    const slot = this.CharacterToSlot(event.key);
    if (slot === Slot.NotWorn || this.unequip(slot)) stack.pop();
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
