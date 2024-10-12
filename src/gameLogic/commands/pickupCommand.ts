import { CommandBase } from './commandBase';
import { EventCategory, LogMessage } from '../messages/logMessage';
import { GameState } from '../../types/gameBuilder/gameState';
import { Inventory } from '../inventory/inventory';
import { Map } from '../../types/gameLogic/maps/mapModel/map';

/**
 * Represents a command to pick up an item from the game map and add it to the player's inventory.
 */
export class PickupCommand extends CommandBase {
  constructor(public game: GameState) {
    super(game.player, game);
  }

  /**
   * Executes the pickup command.
   * @returns {boolean} Returns true if the command is executed successfully, otherwise false.
   */
  public execute(): boolean {
    const { game } = this;
    const { player } = game;

    const map = <Map>game.currentMap();
    const inventory = <Inventory>game.inventory;
    const cell = map.cell(player.pos);
    const item = cell.obj;

    if (!item) {
      const msg = new LogMessage(
        'There is nothing here to pick up.',
        EventCategory.unable,
      );
      game.flash(msg);
      return false;
    }

    cell.obj = undefined;
    inventory.add(item);

    const msg = new LogMessage(
      `You picked up ${item.description()}.`,
      EventCategory.pickup,
    );
    game.message(msg);

    return true;
  }
}
