import { GameIF } from '../Builder/Interfaces/Game';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';
import { HealthAdjust } from './HealthAdjust';
import { Equipment } from '../Inventory/Equipment';

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
  execute(): boolean {
    const me = this.me.name;
    const him = this.him.name;
    const rnd = this.game.rand;

    let dmg: number = this.calcDamage(rnd, this.me);

    if (this.him.isPlayer) {
      const orig = dmg;
      const factor = this.game.equipment!.armorClass_reduce();
      dmg = Math.ceil(dmg * factor);
      console.log(`${orig} → ${dmg} (${factor})`);
    }

    const rest = this.him.hp - dmg;
    const s = dmg
      ? `${me} hits ${him} for ${dmg}→${rest}`
      : `${me} misses ${him}`;

    if (this.me.isPlayer || this.him.isPlayer) this.game.message(s);

    HealthAdjust.adjust(this.him, -dmg, this.game, this.me);
    return true;
  }

  /**
   * Calculates the damage dealt by the hit command.
   * @param {RandomGenerator} rnd - The random generator used to calculate damage.
   * @param {Mob} me - The mob initiating the hit.
   * @returns {number} The calculated damage.
   */
  calcDamage(rnd: RandomGenerator, me: Mob): number {
    return rnd.randomInteger(0, this.power(me));
  }

  /**
   * Calculates the power of the mob initiating the hit.
   * @param {Mob} me - The mob initiating the hit.
   * @returns {number} The power of the mob.
   */
  power(me: Mob): number {
    return me.isPlayer ? this.playerPower(me) : this.npcPower(me);
  }

  /**
   * Calculates the power of an NPC.
   * @param {Mob} m - The NPC mob.
   * @returns {number} The power of the NPC.
   */
  npcPower(m: Mob): number {
    return m.level + 1;
  }

  /**
   * Returns the base power for an unarmed hit.
   * @returns {number} The base power for an unarmed hit.
   */
  unarmed(): number {
    return 3;
  }

  /**
   * Calculates the power of a player.
   * @param {Mob} player - The player mob.
   * @returns {number} The power of the player.
   */
  playerPower(player: Mob): number {
    const g = this.g;
    if (g.equipment) return this.equipmentPower(g, g.equipment);
    return this.unarmed();
  }

  /**
   * Calculates the power of a player based on their equipment.
   * @param {GameIF} g - The game interface.
   * @param {Equipment} eq - The equipment of the player.
   * @returns {number} The power of the player based on their equipment.
   */
  equipmentPower(g: GameIF, eq: Equipment): number {
    return eq.weapon() ? eq.weaponDamage() : this.unarmed();
  }
}
