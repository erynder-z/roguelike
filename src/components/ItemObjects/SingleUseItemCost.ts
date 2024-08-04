import { Cost } from '../Commands/Types/Cost';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { ItemObject } from './ItemObject';

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
