import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { ItemObject } from './ItemObject';
import { Cost } from '../Commands/Interfaces/Cost';

/**
 * Represents the cost for a single-use item.
 */
export class SingleUseItemCost implements Cost {
  constructor(
    public g: GameIF,
    public obj: ItemObject,
    public objectIndex: number,
  ) {}

  /**
   * Executes the payment process for the single use item.
   *
   * @return {boolean} Returns true if the payment is successful, false otherwise.
   */
  public pay(): boolean {
    const msg = new LogMessage(
      `You use ${this.obj.name()}.`,
      EventCategory.use,
    );
    this.g.message(msg);
    this.g.inventory!.removeIndex(this.objectIndex);

    return true;
  }
}
