import { Cost } from '../commands/types/cost';
import { EventCategory, LogMessage } from '../messages/logMessage';
import { GameState } from '../../gameBuilder/types/gameState';
import { ItemObject } from './itemObject';

/**
 * Represents the cost for a single-use item.
 */
export class SingleUseItemCost implements Cost {
  constructor(
    public game: GameState,
    public obj: ItemObject,
    public objectIndex: number,
  ) {}

  /**
   * Executes the payment process for the single use item.
   *
   * @return {boolean} Returns true if the payment is successful, false otherwise.
   */
  public pay(): boolean {
    const { game } = this;
    const { inventory } = game;

    const msg = new LogMessage(
      `You use ${this.obj.name()}.`,
      EventCategory.use,
    );

    game.message(msg);
    inventory!.removeIndex(this.objectIndex);

    return true;
  }
}