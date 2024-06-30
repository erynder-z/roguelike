import { GameIF } from '../Builder/Interfaces/GameIF';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';
import { Equipment } from '../Inventory/Equipment';
import { Act } from './Act';
import { Buff } from '../Buffs/BuffEnum';
import { HealthAdjust } from './HealthAdjust';
import { LogMessage, EventCategory } from '../Messages/LogMessage';

/**
 * Represents a command to hit another mob.
 * @extends CommandBase
 */
export class HitCommand extends CommandBase {
  constructor(
    public me: Mob,
    public him: Mob,
    public game: GameIF,
    public act: Act = Act.Hit,
  ) {
    super(me, game);
  }

  /**
   * Executes the hit command, dealing damage to the target mob.
   * @returns {boolean} Returns true if the hit was successful, false otherwise.
   */
  public execute(): boolean {
    const g = this.game;
    const m = this.me;
    const rnd = g.rand;

    let dmg: number = this.calcDamage(rnd, m);

    let back: number = 0;

    if (m.is(Buff.Shock) && rnd.isOneIn(2)) {
      dmg = this.shockDmg(dmg);
      back = rnd.randomIntegerClosedRange(2, 3);
    }

    const me = m.name;
    const him = this.him.name;

    this.doDmg(dmg, this.him, m, g, me, him);

    if (back > 0) this.doDmg(back, m, m, g, 'SHOCK', me);

    this.clearCharm(g);
    return true;
  }

  /**
   * Calculates the shock damage based on the given damage.
   *
   * @param {number} dmg - The damage value.
   * @return {number} The calculated shock damage.
   */
  private shockDmg(dmg: number): number {
    return Math.floor(dmg * 1.5);
  }

  /**
   * Deals damage to the target mob, taking into account armor class reduction for player targets.
   *
   * @param {number} dmg - The amount of damage to deal.
   * @param {Mob} target - The mob to receive the damage.
   * @param {Mob} attacker - The mob causing the damage.
   * @param {GameIF} g - The game interface.
   * @param {string} me - The name of the attacking mob.
   * @param {string} him - The name of the target mob.
   */
  private doDmg(
    dmg: number,
    target: Mob,
    attacker: Mob,
    g: GameIF,
    me: string,
    him: string,
  ) {
    if (target.isPlayer) {
      const orig = dmg;
      const factor = this.g.equipment!.armorClass_reduce();
      dmg = Math.ceil(dmg * factor);
      console.log(`${orig}→ ${dmg} (${factor})`);
    }

    const rest = target.hp - dmg;
    const s = dmg
      ? `${me} hits ${him} for ${dmg}→${rest}`
      : `${me} misses ${him}`;
    const msg1 = new LogMessage(s, EventCategory.mobDamage);
    const msg2 = new LogMessage(s, EventCategory.playerDamage);
    if (attacker.isPlayer) {
      g.message(msg1);
      g.addCurrentEvent(EventCategory.playerDamage);
    }
    if (target.isPlayer) {
      g.message(msg2);
      g.addCurrentEvent(EventCategory.mobDamage);
    }

    if (dmg) HealthAdjust.adjust(target, -dmg, g, attacker);
  }

  /**
   * Clears the Charm buff from the target mob.
   *
   * @param {GameIF} g - The game interface.
   */
  private clearCharm(g: GameIF) {
    const h = this.him;

    if (!h.is(Buff.Charm)) return;
    h.buffs.cleanse(Buff.Charm, this.g, h);
  }

  /**
   * Calculates the damage dealt by the hit command.
   * @param {RandomGenerator} rnd - The random generator used to calculate damage.
   * @param {Mob} me - The mob initiating the hit.
   * @returns {number} The calculated damage.
   */
  private calcDamage(rnd: RandomGenerator, me: Mob): number {
    return rnd.randomInteger(0, this.power(me));
  }

  /**
   * Calculates the power of the mob initiating the hit.
   * @param {Mob} me - The mob initiating the hit.
   * @returns {number} The power of the mob.
   */
  private power(me: Mob): number {
    return me.isPlayer ? this.playerPower(me) : this.npcPower(me);
  }

  /**
   * Calculates the power of an NPC.
   * @param {Mob} m - The NPC mob.
   * @returns {number} The power of the NPC.
   */
  private npcPower(m: Mob): number {
    return m.level + 1;
  }

  /**
   * Returns the base power for an unarmed hit.
   * @returns {number} The base power for an unarmed hit.
   */
  private unarmed(): number {
    return 3;
  }

  /**
   * Calculates the power of a player.
   * @param {Mob} player - The player mob.
   * @returns {number} The power of the player.
   */
  private playerPower(player: Mob): number {
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
  private equipmentPower(g: GameIF, eq: Equipment): number {
    const disarm = g.player.is(Buff.Disarm);
    if (eq.weapon()) {
      if (disarm) {
        const msg = new LogMessage(
          'Attacking with your bare hands!',
          EventCategory.attack,
        );
        g.message(msg);
      } else {
        return eq.weaponDamage();
      }
    }
    return this.unarmed();
  }
}
