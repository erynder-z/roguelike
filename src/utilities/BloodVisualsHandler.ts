import { CanSee } from './canSee';
import { EnvironmentChecker } from '../gameLogic/environment/environmentChecker';
import { gameConfigManager } from '../gameConfigManager/gameConfigManager';
import { GameMapType } from '../types/gameLogic/maps/mapModel/gameMapType';
import { GameState } from '../types/gameBuilder/gameState';
import { Mob } from '../gameLogic/mobs/mob';
import { WorldPoint } from '../maps/mapModel/worldPoint';

export class BloodVisualsHandler {
  private static get bloodIntensity(): number {
    return gameConfigManager.getConfig().blood_intensity;
  }

  /**
   * Handles the application of blood visuals on the game map when a mob takes damage.
   *
   * This function calculates the damage ratio and determines whether to
   * apply blood effects on the target's map cell based on the damage
   * threshold or a probabilistic chance. If the conditions are met, blood
   * is added to the cell, visually indicating damage taken by the mob.
   *
   * @param {Mob} target - The mob that received damage.
   * @param {number} dmg - The amount of damage dealt to the mob.
   * @param {GameState} game - The current state of the game.
   */
  public static handleBlood(target: Mob, dmg: number, game: GameState): void {
    if (this.bloodIntensity === 0) return; // No blood if bloodIntensity is 0
    if (!target.pos || target.hp <= 0) return;

    const map = game.currentMap();
    if (!map) return;

    const damageRatio = dmg / target.maxhp;
    const chance = dmg / target.hp;

    const SIGNIFICANT_DAMAGE_THRESHOLD = 0.25;
    if (damageRatio >= SIGNIFICANT_DAMAGE_THRESHOLD || Math.random() < chance) {
      this.addBloodToCell(target.pos, map, damageRatio);
    }
  }

  /**
   * Adds blood effects to a specific cell on the game map based on damage ratio.
   *
   * This function marks the cell as bloody and calculates the blood intensity
   * considering the current blood intensity and damage ratio. If the damage ratio
   * exceeds predefined thresholds, blood splash effects may also be applied
   * to neighboring cells. Blood intensity is capped at a maximum value
   * determined by the blood intensity.
   *
   * @param {WorldPoint} wp - The world point representing the cell's position.
   * @param {GameMapType} map - The map containing the cells.
   * @param {number} dmgRatio - The ratio of damage dealt relative to the maximum health.
   */

  private static addBloodToCell(
    wp: WorldPoint,
    map: GameMapType,
    dmgRatio: number,
  ): void {
    const cell = map.cell(wp);
    cell.bloody.isBloody = true;

    const MAX_BLOOD_INTENSITY =
      this.bloodIntensity === 3 ? 2.0 : this.bloodIntensity === 2 ? 1.5 : 1.0;

    const thresholds = [
      { threshold: 0.2, blood: 0.5, splashArea: 0, splashIntensity: 0 },
      { threshold: 0.5, blood: 1.0, splashArea: 1, splashIntensity: 1.0 },
      { threshold: 0.7, blood: 1.5, splashArea: 2, splashIntensity: 1.5 },
      { threshold: Infinity, blood: 2.0, splashArea: 3, splashIntensity: 2.0 },
    ];

    const entry = thresholds.find(t => dmgRatio <= t.threshold);
    if (entry) {
      const randomModifier = 1 + (Math.random() * 0.3 - 0.15);
      const bloodMultiplier =
        this.bloodIntensity === 3
          ? 1.75
          : this.bloodIntensity === 2
            ? 1.25
            : 1.0;
      const finalBlood = entry.blood * randomModifier * bloodMultiplier;

      cell.bloody.intensity = Math.min(
        cell.bloody.intensity + finalBlood,
        MAX_BLOOD_INTENSITY,
      );

      if (entry.splashArea > 0) {
        this.addBloodSplash(
          wp,
          map,
          entry.splashArea,
          entry.splashIntensity * bloodMultiplier,
        );
      }
    }
  }

  /**
   * Spreads blood to neighboring cells based on the given area, base intensity, and blood intensity.
   * The intensity of the blood is modified based on distance from the center and randomness.
   * The blood intensity multiplies the final intensity.
   * @param {WorldPoint} wp - The center of the blood splash.
   * @param {GameMapType} map - The map containing the cells.
   * @param {number} area - The area of the blood splash.
   * @param {number} baseIntensity - The base intensity of the blood splash.
   */
  private static addBloodSplash(
    wp: WorldPoint,
    map: GameMapType,
    area: number,
    baseIntensity: number,
  ): void {
    const bloodAreaRadius = area;
    const neighbors = wp.getNeighbors(bloodAreaRadius);
    const MAX_BLOOD_INTENSITY =
      this.bloodIntensity === 3 ? 2.0 : this.bloodIntensity === 2 ? 1.5 : 1.0;

    for (const neighbor of neighbors) {
      if (!EnvironmentChecker.isValidNeighbor(neighbor, map)) continue;
      if (!CanSee.checkPointLOS_RayCast(wp, neighbor, map)) continue;

      const neighborCell = map.cell(neighbor);
      const distanceFromCenter = wp.distanceTo(neighbor);
      const intensityModifier = 1 - distanceFromCenter / bloodAreaRadius;
      const randomModifier = 1 + (Math.random() * 0.3 - 0.15);
      const bloodMultiplier =
        this.bloodIntensity === 3
          ? 1.75
          : this.bloodIntensity === 2
            ? 1.25
            : 1.0;
      let finalIntensity =
        baseIntensity * intensityModifier * randomModifier * bloodMultiplier;

      if (distanceFromCenter >= bloodAreaRadius - 2 && Math.random() < 0.5) {
        finalIntensity *= 0.5;
      }

      if (finalIntensity > 0) {
        neighborCell.bloody.isBloody = true;
        neighborCell.bloody.intensity = Math.min(
          neighborCell.bloody.intensity + finalIntensity,
          MAX_BLOOD_INTENSITY,
        );
      }
    }
  }
}
