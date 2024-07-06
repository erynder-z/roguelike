import { ItemObject } from './ItemObject';
import { LogMessage, EventCategory } from '../Messages/LogMessage';
import { Cost } from '../Commands/Interfaces/Cost';
import { GameIF } from '../Builder/Interfaces/GameIF';

/**
 * Represents the cost for a multiple-use item.
 */
export class MultipleUseItemCost implements Cost {
  constructor(
    public g: GameIF,
    public obj: ItemObject,
    public objectIndex: number,
  ) {}

  /**
   * Pay the cost of using a multiple-use item.
   *
   * @return {boolean} True if the cost was successfully paid, false otherwise.
   */
  public pay(): boolean {
    const o = this.obj;
    if (o.charges <= 0) {
      const msg = new LogMessage(
        `${o.description()} is out of charges!`,
        EventCategory.unable,
      );
      this.g.message(msg);
    } else {
      --o.charges;
      if (o.charges > 0) return true;
      const msg = new LogMessage(
        `${o.description()} is out of charges!`,
        EventCategory.use,
      );

      this.g.message(msg);
    }
    this.g.inventory!.removeIndex(this.objectIndex);
    return true;
  }
}
