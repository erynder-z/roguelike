import { GameIF } from '../Builder/Interfaces/GameIF';
import { Inventory } from '../Inventory/Inventory';
import { ItemObject } from '../ItemObjects/ItemObject';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { CommandBase } from './CommandBase';

/**
 * Represents a command to drop an item from the player's inventory.
 */
export class DropCommand extends CommandBase {
  /**
   * Constructs a DropCommand instance.
   * @param {ItemObject} item - The item to drop.
   * @param {number} index - The index of the item in the inventory.
   * @param {GameIF} game - The game interface.
   */
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
  execute(): boolean {
    const game = this.game;
    const map = <MapIF>game.currentMap();
    const player = game.player;
    const c = map.cell(player.pos);

    if (c.hasObject()) {
      game.flash('No room to drop here!');
      return false;
    }

    c.obj = this.item;
    const inventory = <Inventory>game.inventory;
    inventory.removeIndex(this.index);

    game.message(`Dropped ${this.item.description()}.`);
    return true;
  }
}
