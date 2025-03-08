import { AttackDamageChangeTick } from '../buffs/attackDamageChangeTick';
import { Buff } from '../buffs/buffEnum';
import { BuffType, Tick } from '../../types/gameLogic/buffs/buffType';
import { CommandBase } from './commandBase';
import { GameState } from '../../types/gameBuilder/gameState';
import { Mob } from '../mobs/mob';

const DEFAULT_BUFF_DURATION = 8;
/**
 * Represents a buff command that requires an extra factor value.
 */
export class BuffCommandWithAmount extends CommandBase {
  constructor(
    public buff: Buff,
    public target: Mob,
    public game: GameState,
    public me: Mob,
    public amount: number,
    public duration: number = DEFAULT_BUFF_DURATION,
    public timeLeft: number = duration,
  ) {
    super(me, game);
  }

  /**
   * Executes the buff command that requires a factor.
   * @returns {boolean} Always returns true.
   */
  public execute(): boolean {
    const { game, target, amount } = this;

    let effect: Tick | undefined = undefined;
    switch (this.buff) {
      case Buff.AttackUp:
        effect = new AttackDamageChangeTick(target, game, amount);
        break;
    }

    const active: BuffType = {
      buff: this.buff,
      duration: this.duration,
      timeLeft: this.timeLeft,
      effect: effect,
    };

    this.addBuffToMob(active, this.game, this.target);
    return true;
  }

  /**
   * Add a buff to a mob in the game.
   *
   * @param {BuffType} active - the buff to add
   * @param {GameState} game - the game where the mob exists
   * @param {Mob} mob - the mob to add the buff to
   */
  private addBuffToMob(active: BuffType, game: GameState, mob: Mob) {
    mob.buffs.add(active, game, mob);
  }
}
