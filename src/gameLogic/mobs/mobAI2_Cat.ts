import { GameState } from '../../types/gameBuilder/gameState';
import { Mob } from './mob';
import { MobAI } from '../../types/gameLogic/mobs/mobAI';
import { MoveBumpCommand } from '../commands/moveBumpCommand';
import { Stack } from '../../types/terminal/stack';
import { ScreenMaker } from '../../types/gameLogic/screens/ScreenMaker';

/**
 * Represents an implementation of MobAI for a cat-type mob.
 * Cats always move in the direction of the player.
 */
export class MobAI2_Cat implements MobAI {
  public turn(
    me: Mob,
    enemy: Mob,
    game: GameState,
    stack: Stack,
    make: ScreenMaker,
  ): boolean {
    const { rand } = game;
    if (rand.isOneIn(3)) return false;
    const dir = me.pos.directionTo(enemy.pos);
    const cmd = new MoveBumpCommand(dir, me, game, stack, make);
    return cmd.npcTurn();
  }
}
