import { GameIF } from '../Builder/Interfaces/GameIF';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { Mob } from '../Mobs/Mob';
import { TickIF } from './Interfaces/BuffIF';

export class FreezeTick implements TickIF {
  constructor(
    public mob: Mob,
    public game: GameIF,
  ) {}

  /**
   * Executes a tick of the FreezeTick class.
   * Deals 0-2 damage every second turn if not moving for 2 or more turns.
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  tick(time: number): void {
    if (time % 2) return;
    if (this.mob.sinceMove < 2) return;
    const dmg = this.game.rand.randomIntegerClosedRange(0, 2);
    if (this.mob.isPlayer)
      this.game.message(`You take ${dmg} damage because you are freezing!`);

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
