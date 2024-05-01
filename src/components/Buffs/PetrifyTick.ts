import { GameIF } from '../Builder/Interfaces/Game';
import { HealthAdjust } from '../Commands/HealthAdjust';
import { Mob } from '../Mobs/Mob';
import { TickIF } from './Interfaces/BuffIF';

export class PetrifyTick implements TickIF {
  constructor(
    public mob: Mob,
    public game: GameIF,
  ) {}

  /**
   * Executes a tick of the FreezeTick class.
   * Deals gradually increasing damage every second turn if not moving for 2 or more turns.
   *
   * @param {number} time - The current time of the game.
   * @return {void} This function does not return anything.
   */
  tick(time: number): void {
    if (time % 2) return;
    const sinceLastMove = this.mob.sinceMove;
    if (sinceLastMove < 2) return;
    const dmg = this.game.rand.randomIntegerClosedRange(
      sinceLastMove,
      sinceLastMove * 2,
    );
    if (this.mob.isPlayer)
      this.game.message(`You are being petrified and take ${dmg} damage!`);

    HealthAdjust.damage(this.mob, dmg, this.game, null);
  }
}
