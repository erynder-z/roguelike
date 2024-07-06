import { BurnTick } from '../Buffs/BurnTick';
import { BuffIF, TickIF } from '../Buffs/Interfaces/BuffIF';
import { Buff } from '../Buffs/BuffEnum';
import { BleedTick } from '../Buffs/BleedTick';
import { FreezeTick } from '../Buffs/FreezeTick';
import { GameIF } from '../Builder/Interfaces/GameIF';
import { Mob } from '../Mobs/Mob';
import { PetrifyTick } from '../Buffs/PetrifyTick';
import { PoisonTick } from '../Buffs/PoisonTick';
import { CommandBase } from './CommandBase';

const BURN_DMG_MIN = 2;
const BURN_DMG_MAX = 4;
const LAVA_DMG_MIN = 5;
const LAVA_DMG_MAX = 10;

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
  public execute(): boolean {
    const m = this.target;
    const g = this.g;
    let effect: TickIF | undefined = undefined;
    switch (this.buff) {
      case Buff.Poison:
        effect = new PoisonTick(m, g);
        break;
      case Buff.Burn:
        effect = new BurnTick(m, g, BURN_DMG_MIN, BURN_DMG_MAX);
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
      case Buff.Lava:
        effect = new BurnTick(m, g, LAVA_DMG_MIN, LAVA_DMG_MAX);
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
  private addBuffToMob(active: BuffIF, game: GameIF, mob: Mob) {
    mob.buffs.add(active, game, mob);
  }
}
