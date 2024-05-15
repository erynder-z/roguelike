import { BleedTick } from '../Buffs/BleedTick';
import { Buff } from '../Buffs/BuffEnum';
import { BurnTick } from '../Buffs/BurnTick';
import { FreezeTick } from '../Buffs/FreezeTick';
import { BuffIF, TickIF } from '../Buffs/Interfaces/BuffIF';
import { PetrifyTick } from '../Buffs/PetrifyTick';
import { PoisonTick } from '../Buffs/PoisonTick';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';

/**
 * Represents the buff command that adds a buff to a mob.
 */
export class BuffCommand extends CommandBase {
  constructor(
    public buff: Buff,
    public target: Mob,
    game: GameIF,
    me: Mob,
    public time: number = 8,
  ) {
    super(me, game);
  }
  /**
   * Executes the buff command.
   * @returns {boolean} Always returns true.
   */
  execute(): boolean {
    const m = this.target;
    const g = this.g;
    let effect: TickIF | undefined = undefined;
    switch (this.buff) {
      case Buff.Poison:
        effect = new PoisonTick(m, g);
        break;
      case Buff.Burn:
        effect = new BurnTick(m, g);
        break;
      case Buff.Freeze:
        effect = new FreezeTick(m, g);
        break;
      case Buff.Bleed:
        effect = new BleedTick(m, g);
        break;
      case Buff.Petrify:
        effect = new PetrifyTick(m, g);
        break;
    }

    const active: BuffIF = {
      buff: this.buff,
      time: this.time,
      effect: effect,
    };

    this.addBuffToMob(active, this.g, this.target);
    return true;
  }

  /**
   * Add a buff to a mob in the game.
   *
   * @param {BuffIF} active - the buff to add
   * @param {GameIF} game - the game where the mob exists
   * @param {Mob} mob - the mob to add the buff to
   */
  addBuffToMob(active: BuffIF, game: GameIF, mob: Mob) {
    mob.buffs.add(active, game, mob);
  }
}
