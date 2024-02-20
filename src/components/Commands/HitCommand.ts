import { GameIF } from '../../interfaces/Builder/Game';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';
import { HealthAdjust } from './HealthAdjust';

/**
 * Represents a command to hit another mob.
 * @extends CommandBase
 */
export class HitCommand extends CommandBase {
  /**
   * Creates an instance of HitCommand.
   * @param {Mob} me - The mob initiating the hit.
   * @param {Mob} him - The mob being hit.
   * @param {GameIF} game - The game interface.
   */
  constructor(
    public me: Mob,
    public him: Mob,
    public game: GameIF,
  ) {
    super(me, game);
  }

  /**
   * Executes the hit command, dealing damage to the target mob.
   * @returns {boolean} Returns true if the hit was successful, false otherwise.
   */
  execute0(): boolean {
    const me = this.me.name;
    const him = this.him.name;
    const dmg = 1;
    const s = `${me} hits ${him} for ${dmg} damage.`;
    this.him.hp -= dmg;
    console.log(s);
    return true;
  }

  /**
   * Executes the hit command, dealing damage to the target mob.
   * @returns {boolean} Returns true if the hit was successful, false otherwise.
   */
  execute(): boolean {
    const me = this.me.name;
    const him = this.him.name;
    const rand = this.game.rand;

    let dmg = rand.randomIntegerClosedRange(0, 3);
    if (dmg === 3) dmg = 1;

    const s = dmg
      ? `${me} hits ${him} for ${dmg} damage.`
      : `${me} misses ${him}.`;

    if (this.me.isPlayer || this.him.isPlayer) {
      this.game.message(s);
    }

    HealthAdjust.adjust(this.him, -dmg, this.game, this.me);
    return true;
  }
}
