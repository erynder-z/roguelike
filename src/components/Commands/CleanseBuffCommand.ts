import { Buff } from '../Buffs/BuffEnum';
import { CommandBase } from './CommandBase';
import { EventCategory, LogMessage } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { Mob } from '../Mobs/Mob';
import { MobMessagesHandler } from '../Utilities/MobMessagesHandler';

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

    if (
      me.isPlayer ||
      MobMessagesHandler.shouldDisplayMessage(game, me, player)
    ) {
      const s = me.isPlayer ? 'You are' : `${me.name} is`;
      const msg = new LogMessage(
        `${s} cleansed of ${Buff[this.buff]}!`,
        EventCategory.heal,
      );

      game.message(msg);
    }

    return true;
  }
}
