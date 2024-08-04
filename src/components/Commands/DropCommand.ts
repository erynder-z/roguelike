import { CommandBase } from './CommandBase';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Inventory } from '../Inventory/Inventory';
import { ItemObject } from '../ItemObjects/ItemObject';
import { Map } from '../MapModel/Types/Map';

/**
 * Represents a command to drop an item from the player's inventory.
 */
export class DropCommand extends CommandBase {
  constructor(
    public item: ItemObject,
    public index: number,
    public game: GameState,
  ) {
    super(game.player, game);
  }

  /**
   * Executes the drop command.
   * @returns {boolean} True if the item was dropped successfully, otherwise false.
   */

  public execute(): boolean {
    const { game } = this;
    const { player } = game;

    const map = <Map>game.currentMap();
    const cell = map.cell(player.pos);

    if (cell.hasObject()) {
      const msg = new LogMessage('No room to drop here!', EventCategory.unable);
      game.flash(msg);
      return false;
    }

    cell.obj = this.item;
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
