import { GameIF } from '../Builder/Interfaces/GameIF';
import { Equipment } from '../Inventory/Equipment';
import { ItemObject } from '../ItemObjects/ItemObject';
import { Slot } from '../ItemObjects/Slot';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { CommandBase } from './CommandBase';

/**
 * Represents a command to unequip an item in a game.
 */
export class UnequipCommand extends CommandBase {
  constructor(
    public slot: Slot,
    public game: GameIF,
  ) {
    super(game.player, game);
  }

  /**
   * Executes the unequip command.
   * @returns {boolean} True if the command executed successfully, false otherwise.
   */
  execute(): boolean {
    const slot = this.slot;
    if (slot == Slot.NotWorn) return false;

    const game = this.game;
    const equipment = <Equipment>game.equipment;

    if (!equipment.has(slot)) {
      const label = Slot[slot];
      const msg = new LogMessage(
        `${label} is not equipped.`,
        EventCategory.unable,
      );
      this.game.flash(msg);
      return false;
    }
    const obj: ItemObject | undefined = equipment.get(slot);
    if (!obj) throw 'obj is undefined';

    equipment.remove(slot);
    game.inventory!.add(obj);
    const msg = new LogMessage(
      `${obj.description()} is now unequipped.`,
      EventCategory.equip,
    );
    game.message(msg);
    return true;
  }
}
