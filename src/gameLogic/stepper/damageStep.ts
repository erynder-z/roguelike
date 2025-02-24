import { EnvironmentChecker } from '../environment/environmentChecker';
import { EventCategory, LogMessage } from '../messages/logMessage';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { GameState } from '../../types/gameBuilder/gameState';
import { HealthAdjust } from '../commands/healthAdjust';
import { Mob } from '../mobs/mob';
import { Step } from '../../types/gameLogic/stepper/step';
import { TimedStep } from './timedStep';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

/**
 * Represents a timed step that damages a mob at its current position.
 */
export class DamageStep extends TimedStep {
  constructor(
    public amount: number,
    public weaponType: RangedWeaponType,
    public actor: Mob,
    public game: GameState,
    public target: Mob | null = null,
    public pos: WorldPoint | null = null,
  ) {
    super();
  }

  /**
   * Sets the target of the function to the specified Mob.
   *
   * @param {Mob} tgt - The Mob object to set as the target.
   * @return {void} This function does not return anything.
   */
  public setTarget(tgt: Mob): void {
    this.target = tgt;
  }

  /**
   * Sets the position of the object to the specified world point.
   *
   * @param {WorldPoint} pos - The world point to set the position to.
   * @return {void} This function does not return anything.
   */
  public setPos(pos: WorldPoint): void {
    this.pos = pos.copy();
  }

  /**
   * Executes the step and damages the target.
   *
   * @return {StepIF | null} The executed step or null if no target is found.
   */
  public executeStep(): Step | null {
    let tgt = this.target;
    if (!tgt) tgt = this.targetFromPosition();
    if (tgt) {
      const msg = new LogMessage(
        ` ${tgt.name} gets hit by a ranged weapon for ${this.amount} damage`,
        EventCategory.none,
      );

      this.game.message(msg);

      if (this.amount > 0) this.handleBlood(tgt, this.amount);

      HealthAdjust.damage(tgt, this.amount, this.game, this.actor);
    } else {
      console.log('did not hit any target');
    }
    return null;
  }

  /**
   * Retrieves the target Mob based on the current position.
   *
   * @return {Mob | null} The target Mob if found, otherwise null.
   */
  private targetFromPosition(): Mob | null {
    if (this.pos) {
      const map = <GameMapType>this.game.currentMap();
      const cell = map.cell(this.pos);
      if (cell.mob) return cell.mob;
    }
    return null;
  }

  /**
   * Returns the type of ranged weapon used in this step.
   *
   * @return {RangedWeaponType} The type of ranged weapon.
   */
  public rangedWeaponType(): RangedWeaponType {
    return this.weaponType;
  }

  /**
   * Adds blood to the ground if a mob was significantly damaged (lost at least 25% of its HP) or if a random chance is met.
   *
   * @param {Mob} target - The mob that was damaged.
   * @param {number} dmg - The amount of damage that was dealt to the mob.
   */
  private handleBlood(target: Mob, dmg: number): void {
    if (!target.pos || target.hp <= 0) return;

    const map = this.game.currentMap();
    if (!map) return;

    const damageRatio = dmg / target.maxhp;
    const chance = dmg / target.hp;

    const SIGNIFICANT_DAMAGE_THRESHOLD = 0.25;

    // Apply blood if either significant damage occurred or if a random chance is met.
    if (damageRatio >= SIGNIFICANT_DAMAGE_THRESHOLD || Math.random() < chance) {
      EnvironmentChecker.addBloodToCell(target.pos, map, damageRatio);
    }
  }
}

export enum RangedWeaponType {
  Pistol,
  Rifle,
  Crossbow,
  Bow,
}
