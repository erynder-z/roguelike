import { Buff } from '../Buffs/BuffEnum';
import { CommandBase } from './CommandBase';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Mob } from '../Mobs/Mob';
import { GameMap } from '../MapModel/GameMap';
import { CanSee } from '../Utilities/CanSee';

/**
 * Represents a command that removes a given buff from the given mob.
 */
export class CleanseBuffCommand extends CommandBase {
  constructor(
    public buff: Buff,
    public me: Mob,
    public game: GameState,
  ) {
    super(me, game);
  }

  /**
   * Executes the command to cleanse a specific buff from the mob.
   *
   * @return {boolean} Returns true if the command was executed successfully.
   */
  public execute(): boolean {
    const { me, game } = this;
    const { player } = game;

    if (this.buff) this.me.buffs.cleanse(this.buff, game, me);

    const shouldDisplayMessage = this.shouldDisplayMessage(game, me, player);

    if (shouldDisplayMessage) {
      const s = me.isPlayer ? 'You are' : `${me.name} is`;
      const msg = new LogMessage(
        `${s} cleansed of ${Buff[this.buff]}!`,
        EventCategory.heal,
      );

      game.message(msg);
    }

    return true;
  }

  /**
   * Determines whether a message should be displayed based on the visibility of the mob to the player.
   *
   * @param {GameState} game - The current game state.
   * @param {Mob} mob - The mob for which the message is being considered.
   * @param {Mob} player - The player mob.
   * @return {boolean} True if the message should be displayed, false otherwise.
   */
  private shouldDisplayMessage(
    game: GameState,
    mob: Mob,
    player: Mob,
  ): boolean {
    const map = <GameMap>game.currentMap();

    const iVisible = CanSee.checkMobLOS_Bresenham(mob, player, map, false);

    return iVisible;
  }
}
