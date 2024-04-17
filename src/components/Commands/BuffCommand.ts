import { Buff } from '../Buffs/BuffEnum';
import { BuffIF, TickIF } from '../Buffs/Interfaces/BuffIF';
import { GameIF } from '../Builder/Interfaces/Game';
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
  ) {
    super(me, game);
  }
  /**
   * Executes the buff command.
   * @returns {boolean} Always returns true.
   */
  execute(): boolean {
    const effect: TickIF | undefined = undefined;

    switch (this.buff) {
      case Buff.Poison:
        /*   effect = new PoisonTick(m, g); */
        break;
    }

    const active: BuffIF = {
      buff: this.buff,
      time: 8,
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