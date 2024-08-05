import { Act } from './Act';
import { Buff } from '../Buffs/BuffEnum';
import { CommandBase } from './CommandBase';
import { Equipment } from '../Inventory/Equipment';
import { EventCategory } from '../Messages/LogMessage';
import { GameState } from '../Builder/Types/GameState';
import { HealthAdjust } from './HealthAdjust';
import { LogMessage } from '../Messages/LogMessage';
import { Mob } from '../Mobs/Mob';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';

/**
 * Represents a command to hit another mob.
 * @extends CommandBase
 */
export class HitCommand extends CommandBase {
  constructor(
    public me: Mob,
    public him: Mob,
    public game: GameState,
    public act: Act = Act.Hit,
  ) {
    super(me, game);
  }

  /**
   * Executes the hit command, dealing damage to the target mob.
   * @returns {boolean} Returns true if the hit was successful, false otherwise.
   */
  public execute(): boolean {
    const { game, me } = this;
    const { rand } = game;

    let dmg: number = this.calcDamage(rand, me);
    let back: number = 0;

    if (me.is(Buff.Shock) && rand.isOneIn(2)) {
      dmg = this.shockDmg(dmg);
      back = rand.randomIntegerClosedRange(2, 3);
    }

    const damageDealer = me.name;
    const damageReceiver = this.him.name;

    this.doDmg(dmg, this.him, me, game, damageDealer, damageReceiver);

    if (back > 0) this.doDmg(back, me, me, game, 'SHOCK', damageDealer);

    this.clearCharm(game);
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
   * @param {GameState} game - The game object.
   * @param {string} me - The name of the attacking mob.
   * @param {string} him - The name of the target mob.
   */
  private doDmg(
    dmg: number,
    target: Mob,
    attacker: Mob,
    game: GameState,
    me: string,
    him: string,
  ) {
    if (target.isPlayer) {
      const orig = dmg;
      const factor = this.game.equipment!.armorClass_reduce();
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
      game.message(msg1);
      game.addCurrentEvent(EventCategory.playerDamage);
    }
    if (target.isPlayer) {
      game.message(msg2);
      game.addCurrentEvent(EventCategory.mobDamage);
    }

    if (dmg) HealthAdjust.adjust(target, -dmg, game, attacker);
  }

  /**
   * Clears the Charm buff from the target mob.
   *
   * @param {GameState} game - The game object.
   */
  private clearCharm(game: GameState) {
    const { him } = this;

    if (!him.is(Buff.Charm)) return;
    him.buffs.cleanse(Buff.Charm, this.game, him);
  }

  /**
   * Calculates the damage dealt by the hit command.
   * @param {RandomGenerator} rand - The random generator used to calculate damage.
   * @param {Mob} me - The mob initiating the hit.
   * @returns {number} The calculated damage.
   */
  private calcDamage(rand: RandomGenerator, me: Mob): number {
    return rand.randomInteger(0, this.power(me));
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
   * @param {Mob} mob - The NPC mob.
   * @returns {number} The power of the NPC.
   */
  private npcPower(mob: Mob): number {
    return mob.level + 1;
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
    const game = this.game;
    if (game.equipment) return this.equipmentPower(game, game.equipment);
    return this.unarmed();
  }

  /**
   * Calculates the power of a player based on their equipment.
   * @param {GameState} game - The game object.
   * @param {Equipment} equipment - The equipment of the player.
   * @returns {number} The power of the player based on their equipment.
   */
  private equipmentPower(game: GameState, equipment: Equipment): number {
    const disarm = game.player.is(Buff.Disarm);
    if (equipment.weapon()) {
      if (disarm) {
        const msg = new LogMessage(
          'Attacking with your bare hands!',
          EventCategory.attack,
        );
        game.message(msg);
      } else {
        return equipment.weaponDamage();
      }
    }
    return this.unarmed();
  }
}
