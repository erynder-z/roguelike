import { GameIF } from '../Builder/Interfaces/GameIF';
import { Inventory } from '../Inventory/Inventory';
import { ItemObject } from '../ItemObjects/ItemObject';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { CommandBase } from './CommandBase';

/**
 * Represents a command to drop an item from the player's inventory.
 */
export class DropCommand extends CommandBase {
  constructor(
    public item: ItemObject,
    public index: number,
    public game: GameIF,
  ) {
    super(game.player, game);
  }

  /**
   * Executes the drop command.
   * @returns {boolean} True if the item was dropped successfully, otherwise false.
   */
  public execute(): boolean {
    const game = this.game;
    const map = <MapIF>game.currentMap();
    const player = game.player;
    const c = map.cell(player.pos);

    if (c.hasObject()) {
      const msg = new LogMessage('No room to drop here!', EventCategory.unable);
      game.flash(msg);
      return false;
    }

    c.obj = this.item;
    const inventory = <Inventory>game.inventory;
    inventory.removeIndex(this.index);

    const msg = new LogMessage(
      `Dropped ${this.item.description()}.`,
      EventCategory.drop,
    );

    game.message(msg);
    return true;
  }
}
