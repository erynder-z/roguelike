import { GameIF } from '../Builder/Interfaces/GameIF';
import { Cost } from '../Commands/Interfaces/Cost';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { ItemObject } from './ItemObject';

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
  pay(): boolean {
    const msg = new LogMessage(
      `You use ${this.obj.name()}.`,
      EventCategory.use,
    );
    console.log('test');
    this.g.message(msg);
    this.g.inventory!.removeIndex(this.objectIndex);

    return true;
  }
}
