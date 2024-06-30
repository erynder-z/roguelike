import { MobAI } from './Interfaces/MobAI';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { MoveCommand } from '../Commands/MoveCommand';
import { Mob } from './Mob';

/**
 * Represents an implementation of MobAI for a pawn-type mob.
 */
export class MobAI1_Pawn implements MobAI {
  /**
   * The turn function calculates the direction from 'me' to 'enemy' and creates a new MoveCommand to move 'me' in that direction using 'game'. Then it calls the npcTurn method of the created command and returns the result.
   *
   * @param {Mob} me - The 'me' Mob object
   * @param {Mob} enemy - The 'enemy' Mob object
   * @param {GameIF} game - The GameIF object
   * @return {boolean} The result of the npcTurn method call
   */
  public turn(me: Mob, enemy: Mob, game: GameIF): boolean {
    const dir = me.pos.directionTo(enemy.pos);
    const cmd = new MoveCommand(dir, me, game);
    return cmd.npcTurn();
  }
}
