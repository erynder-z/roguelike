import { MobAI } from './Interfaces/MobAI';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { MoveBumpCommand } from '../Commands/MoveBumpCommand';
import { Mob } from './Mob';

/**
 * Represents an implementation of MobAI for a ant-type mob.
 * Ants always move in a random direction.
 */
export class MobAI3_Ant implements MobAI {
  /**
   * Executes a turn for the Ant mob AI.
   * @param {Mob} me - The current mob controlled by this AI.
   * @param {Mob} enemy - The enemy mob.
   * @param {GameIF} game - The game interface.
   * @returns {boolean} - True if the turn was successfully executed, false otherwise.
   */
  turn(me: Mob, enemy: Mob, game: GameIF): boolean {
    const r = game.rand;
    const dir = r.randomDirectionForcedMovement();
    return new MoveBumpCommand(dir, me, game).npcTurn();
  }
}
