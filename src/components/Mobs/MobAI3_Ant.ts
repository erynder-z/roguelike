import { GameState } from '../Builder/Types/GameState';
import { Mob } from './Mob';
import { MobAI } from './Types/MobAI';
import { MoveBumpCommand } from '../Commands/MoveBumpCommand';

/**
 * Represents an implementation of MobAI for a ant-type mob.
 * Ants always move in a random direction.
 */
export class MobAI3_Ant implements MobAI {
  /**
   * Executes a turn for the Ant mob AI.
   * @param {Mob} me - The current mob controlled by this AI.
   * @param {Mob} enemy - The enemy mob.
   * @param {GameState} game - The game object.
   * @returns {boolean} - True if the turn was successfully executed, false otherwise.
   */
  public turn(me: Mob, enemy: Mob, game: GameState): boolean {
    const { rand } = game;
    const dir = rand.randomDirectionForcedMovement();
    return new MoveBumpCommand(dir, me, game).npcTurn();
  }
}
