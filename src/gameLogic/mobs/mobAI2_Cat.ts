import { GameState } from '../../types/gameBuilder/gameState';
import { Mob } from './mob';
import { MobAI } from '../../types/gameLogic/mobs/mobAI';
import { MoveBumpCommand } from '../commands/moveBumpCommand';

/**
 * Represents an implementation of MobAI for a cat-type mob.
 * Cats always move in the direction of the player.
 */
export class MobAI2_Cat implements MobAI {
  /**
   * The turn function calculates the direction from 'me' to 'enemy' and creates a new MoveCommand to move 'me' in that direction using 'game'. Then it calls the npcTurn method of the created command and returns the result.
   *
   * @param {Mob} me - The 'me' Mob object
   * @param {Mob} enemy - The 'enemy' Mob object
   * @param {GameState} game - The Game object
   * @return {boolean} The result of the npcTurn method call
   */
  public turn(me: Mob, enemy: Mob, game: GameState): boolean {
    const { rand } = game;
    if (rand.isOneIn(3)) return false;
    const dir = me.pos.directionTo(enemy.pos);
    const cmd = new MoveBumpCommand(dir, me, game);
    return cmd.npcTurn();
  }
}
