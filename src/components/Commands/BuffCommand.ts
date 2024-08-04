import { BurnTick } from '../Buffs/BurnTick';
import { BuffType, Tick } from '../Buffs/Types/BuffType';
import { Buff } from '../Buffs/BuffEnum';
import { BleedTick } from '../Buffs/BleedTick';
import { CommandBase } from './CommandBase';
import { FreezeTick } from '../Buffs/FreezeTick';
import { GameState } from '../Builder/Types/GameState';
import { Mob } from '../Mobs/Mob';
import { PetrifyTick } from '../Buffs/PetrifyTick';
import { PoisonTick } from '../Buffs/PoisonTick';

const BURN_DMG_MIN = 2;
const BURN_DMG_MAX = 4;
const LAVA_DMG_MIN = 5;
const LAVA_DMG_MAX = 10;
const DEFAULT_BUFF_DURATION = 8;

/**
 * Represents the buff command that adds a buff to a mob.
 */
export class BuffCommand extends CommandBase {
  constructor(
    public buff: Buff,
    public target: Mob,
    game: GameState,
    me: Mob,
    public duration: number = DEFAULT_BUFF_DURATION,
    public timeLeft: number = duration,
  ) {
    super(me, game);
  }
  /**
   * Executes the buff command.
   * @returns {boolean} Always returns true.
   */
  public execute(): boolean {
    const { game, target } = this;

    let effect: Tick | undefined = undefined;
    switch (this.buff) {
      case Buff.Poison:
        effect = new PoisonTick(target, game);
        break;
      case Buff.Burn:
        effect = new BurnTick(target, game, BURN_DMG_MIN, BURN_DMG_MAX);
        break;
      case Buff.Freeze:
        effect = new FreezeTick(target, game);
        break;
      case Buff.Bleed:
        effect = new BleedTick(target, game);
        break;
      case Buff.Petrify:
        effect = new PetrifyTick(target, game);
        break;
      case Buff.Lava:
        effect = new BurnTick(target, game, LAVA_DMG_MIN, LAVA_DMG_MAX);
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
