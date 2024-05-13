import { GameIF } from '../Builder/Interfaces/GameIF';
import { Inventory } from '../Inventory/Inventory';
import { MapIF } from '../MapModel/Interfaces/MapIF';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { CommandBase } from './CommandBase';

/**
 * Represents a command to pick up an item from the game map and add it to the player's inventory.
 */
export class PickupCommand extends CommandBase {
  /**
   * Creates an instance of PickupCommand.
   * @param {GameIF} game - The game interface.
   */
  constructor(public game: GameIF) {
    super(game.player, game);
  }

  /**
   * Executes the pickup command.
   * @returns {boolean} Returns true if the command is executed successfully, otherwise false.
   */
  execute(): boolean {
    const game = this.game;
    const map = <MapIF>game.currentMap();
    const player = game.player;
    const inventory = <Inventory>game.inventory;
    const c = map.cell(player.pos);
    const item = c.obj;

    if (!item) {
      const msg = new LogMessage(
        'There is nothing here to pick up.',
        EventCategory.unable,
      );
      game.flash(msg);
      return false;
    }

    c.obj = undefined;
    inventory.add(item);

    const msg = new LogMessage(
      `You picked up ${item.description()}.`,
      EventCategory.pickup,
    );
    game.message(msg);

    return true;
  }
}
