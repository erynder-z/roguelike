import { GameIF } from '../Builder/Interfaces/GameIF';
import { RandomGenerator } from '../RandomGenerator/RandomGenerator';
import { Mob } from '../Mobs/Mob';
import { CommandBase } from './CommandBase';
import { Equipment } from '../Inventory/Equipment';
import { Act } from './Act';
import { Buff } from '../Buffs/BuffEnum';
import { HealthAdjust } from './HealthAdjust';
import { ImageHandler } from '../ImageHandler/ImageHandler';
import attackImages from '../ImageHandler/attackImages';

/**
 * Represents a command to hit another mob.
 * @extends CommandBase
 */
export class HitCommand extends CommandBase {
  act: Act = Act.Hit;

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
  shockDmg(dmg: number): number {
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
  doDmg(
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
    if (attacker.isPlayer || target.isPlayer) g.message(s);
    if (dmg) HealthAdjust.adjust(target, -dmg, g, attacker);
    if (attacker.isPlayer) this.displayActionImage(g);
  }

  /**
   * Clears the Charm buff from the target mob.
   *
   * @param {GameIF} g - The game interface.
   */
  clearCharm(g: GameIF) {
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
    const disarm = g.player.is(Buff.Disarm);
    if (eq.weapon()) {
      if (disarm) {
        g.message('Attacking with your bare hands!');
      } else {
        return eq.weaponDamage();
      }
    }
    return this.unarmed();
  }

  /**
   * Displays an action image on the screen.
   *
   * @param {GameIF} game - The game information containing the necessary data.
   */
  displayActionImage(game: GameIF) {
    const r = game.rand;
    const randomImage = r.getRandomImageFromArray(attackImages);
    const image = new Image();
    image.src = randomImage;
    const imageHandler = ImageHandler.getInstance();

    const shouldDrawImage =
      imageHandler.getCurrentImageDataAttribute() !== 'attack';

    const maybeDrawImage = r.randomIntegerClosedRange(0, 2) === 0;

    if (shouldDrawImage) {
      // If not currently attacking, display the image
      imageHandler.displayImage(image, 'attack');
    } else {
      // There's a 1/3 chance of displaying a different image. If not, the current image remains shown.
      if (maybeDrawImage) imageHandler.displayImage(image, 'attack');
    }
  }
}
