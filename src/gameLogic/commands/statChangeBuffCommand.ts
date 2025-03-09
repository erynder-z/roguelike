import { AttackDamageChangeTick } from '../buffs/attackDamageChangeTick';
import { Buff } from '../buffs/buffEnum';
import { BuffCommand } from './buffCommand';
import { BuffType, Tick } from '../../types/gameLogic/buffs/buffType';
import { GameState } from '../../types/gameBuilder/gameState';
import { Mob } from '../mobs/mob';

const DEFAULT_BUFF_DURATION = 50;

export class StatChangeBuffCommand extends BuffCommand {
  constructor(
    public buff: Buff,
    public target: Mob,
    public game: GameState,
    public me: Mob,
    public amount: number,
    public duration: number = DEFAULT_BUFF_DURATION,
    public timeLeft: number = duration,
  ) {
    super(buff, target, game, me, duration, timeLeft);
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

    super.addBuffToMob(active, this.game, this.target);
    return true;
  }
}
