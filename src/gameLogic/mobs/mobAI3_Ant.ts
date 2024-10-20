import { GameState } from '../../types/gameBuilder/gameState';
import { Mob } from './mob';
import { MobAI } from '../../types/gameLogic/mobs/mobAI';
import { MoveBumpCommand } from '../commands/moveBumpCommand';

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
