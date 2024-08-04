import { Cost } from '../Commands/Types/Cost';
import { GameState } from '../Builder/Types/GameState';
import { ItemObject } from './ItemObject';
import { LogMessage, EventCategory } from '../Messages/LogMessage';

/**
 * Represents the cost for a multiple-use item.
 */
export class MultipleUseItemCost implements Cost {
  constructor(
    public game: GameState,
    public obj: ItemObject,
    public objectIndex: number,
  ) {}

  /**
   * Pay the cost of using a multiple-use item.
   *
   * @return {boolean} True if the cost was successfully paid, false otherwise.
   */
  public pay(): boolean {
    const { obj } = this;

    if (obj.charges <= 0) {
      const msg = new LogMessage(
        `${obj.description()} is out of charges!`,
        EventCategory.unable,
      );
      this.game.message(msg);
    } else {
      --obj.charges;
      if (obj.charges > 0) return true;
      const msg = new LogMessage(
        `${obj.description()} is out of charges!`,
        EventCategory.use,
      );

      this.game.message(msg);
    }
    this.game.inventory!.removeIndex(this.objectIndex);
    return true;
  }
}
