import { EventCategory, LogMessage } from '../../gameLogic/messages/logMessage';
import { GameState } from '../../types/gameBuilder/gameState';
import { HealthAdjust } from '../../gameLogic/commands/healthAdjust';
import { Mob } from '../../gameLogic/mobs/mob';

/**
 * Utility class for handling chams.
 */
export class ChasmHandler {
  /**
   * Handle moving on a chasm edge cell.
   *
   * There is a one in three chance of falling into the chasm.
   * If the mob is the player, a message is printed to the log.
   * Otherwise, the mob is moved to the center of the chasm.
   *
   * @param mob The mob to handle.
   * @param game The current game state.
   */
  public static handleChasmEdge(mob: Mob, game: GameState): void {
    const fallChance = game.rand.isOneIn(3);

    if (fallChance) {
      this.handleChasmCenter(mob, game);
    } else {
      if (mob.isPlayer)
        game.flash(
          new LogMessage(
            'You feel the ground beneath your feet crumbling.',
            EventCategory.chasmDanger,
          ),
        );
    }
  }

  /**
   * Handle moving on a chasm center cell.
   *
   * @param {Mob} mob - the current mob
   * @return {void}
   */
  public static handleChasmCenter(mob: Mob, game: GameState): void {
    const s = mob.isPlayer ? 'You fall' : `${mob.name} falls`;
    const msg = new LogMessage(
      `${s} into the abyss!`,
      EventCategory.playerDeath,
    );
    game.message(msg);
    HealthAdjust.mobDeathWithoutCorpseAndLoot(mob, game, true);
  }
}
