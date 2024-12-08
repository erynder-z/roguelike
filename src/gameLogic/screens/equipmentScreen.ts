import { BaseScreen } from './baseScreen';
import { Equipment } from '../inventory/equipment';
import { EquipmentScreenDisplay } from '../../ui/equipmentScreenDIsplay/equipmentScreenDisplay';
import { GameState } from '../../types/gameBuilder/gameState';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';
import { Slot } from '../itemObjects/slot';
import { Stack } from '../../types/terminal/stack';
import { UnequipCommand } from '../commands/unequipCommand';

/**
 * Represents a equipment screen.
 */
export class EquipmentScreen extends BaseScreen {
  public name = 'equipment-screen';
  private display: EquipmentScreenDisplay | null = null;
  constructor(
    public game: GameState,
    public make: ScreenMaker,
    private equipment: Equipment = <Equipment>game.equipment,
  ) {
    super(game, make);
  }

  /**
   * Converts slot position to corresponding character.
   * @param {Slot} pos - The slot position.
   * @returns {string} The character representing the slot.
   */
  private slotToCharacter(pos: Slot): string {
    return String.fromCharCode(97 + (pos - Slot.MainHand));
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
    const container = document.getElementById('canvas-container');
    if (!this.display) {
      this.display = document.createElement(
        'equipment-screen-display',
      ) as EquipmentScreenDisplay;

      container?.appendChild(this.display);

      const equipmentData = this.getEquipmentData();
      this.display.items = equipmentData;
      this.display.menuKeyText = this.activeControlScheme.menu.toString();
    }
  }

  /**
   * Formats the equipment data for the display component.
   * @returns {Array<{ char: string; slot: string; description: string }>} Formatted equipment data.
   */
  private getEquipmentData(): {
    char: string;
    slot: string;
    description: string;
  }[] {
    const data: { char: string; slot: string; description: string }[] = [];
    for (let slot = Slot.MainHand; slot < Slot.Last; ++slot) {
      const item = this.equipment.get(slot);
      data.push({
        char: this.slotToCharacter(slot),
        slot: Slot[slot],
        description: item ? item.description() : 'none',
      });
    }
    return data;
  }

  /**
   * Fades out the equipment screen.
   * @returns {Promise<void>}
   */
  private async fadeOutEquipmentScreen(): Promise<void> {
    if (this.display) {
      await this.display.fadeOut();
      this.display.remove();
    }
  }

  /**
   * Handles the key down event.
   * @param {KeyboardEvent} event - The keyboard event.
   * @param {Stack} stack - The stack object.
   * @returns {boolean} - True if the event was handled successfully, otherwise false.
   */
  public handleKeyDownEvent(event: KeyboardEvent, stack: Stack): boolean {
    const slot = this.CharacterToSlot(event.key);

    if (
      event.key === this.activeControlScheme.menu.toString() ||
      this.unequip(slot)
    ) {
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
