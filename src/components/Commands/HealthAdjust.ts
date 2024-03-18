import { GameIF } from '../Builder/Interfaces/Game';
import { Map } from '../MapModel/Interfaces/Map';
import { Mob } from '../Mobs/Mob';
import { AutoHeal } from './AutoHeal';

/**
 * A class to handle adjustments to health of a mob.
 */
export class HealthAdjust {
  /**
   * Adjusts the health of a mob based on the specified amount.
   * @param {Mob} mob - The mob whose health is to be adjusted.
   * @param {number} amount - The amount by which the health will be adjusted.
   * @param {GameIF} game - The game interface.
   * @param {Mob} entity - The entity involved in the adjustment.
   */
  public static adjust(mob: Mob, amount: number, game: GameIF, entity: Mob) {
    if (amount === 0) return;
    if (amount > 0) return this.heal(mob, amount);
    if (amount < 0) return this.damage(mob, -amount, game, entity);
  }

  /**
   * Heals the specified amount of health to the given mob.
   * @param {Mob} mob - The mob to be healed.
   * @param {number} amount - The amount of health to be healed.
   */
  public static heal(mob: Mob, amount: number) {
    console.log(`heal ${mob.hp} + ${amount}`);
    const limit = mob.maxhp - mob.hp;
    if (amount > limit) amount = limit;
    mob.hp += amount;
    console.log(`heal ${mob.hp}`);
  }

  /**
   * Deals damage to the specified mob.
   * @param {Mob} mob - The mob to receive the damage.
   * @param {number} amount - The amount of damage to deal.
   * @param {GameIF} game - The game interface.
   * @param {Mob | null} attacker - The mob causing the damage.
   */
  static damage(mob: Mob, amount: number, game: GameIF, attacker: Mob | null) {
    AutoHeal.combatResets(mob, attacker, game);
    console.log('damage', amount, mob.hp);
    mob.hp -= amount;
    console.log('damage to', amount, mob.hp);
    if (mob.hp <= 0) {
      const involvesPlayer =
        mob.isPlayer || (attacker !== null && attacker.isPlayer);
      this.mobDies(mob, game, involvesPlayer);
    }
  }

  /**
   * Handles the death of the specified mob.
   * @param {Mob} mob - The mob that dies.
   * @param {GameIF} game - The game interface.
   */
  static mobDies(mob: Mob, game: GameIF, involvesPlayer: boolean) {
    const s = `${mob.name} dies.`;
    if (involvesPlayer) game.message(s);
    const map = <Map>game.currentMap();
    map.removeMob(mob);
  }
}
