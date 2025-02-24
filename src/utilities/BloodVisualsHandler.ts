import { CanSee } from './canSee';
import { EnvironmentChecker } from '../gameLogic/environment/environmentChecker';
import { GameMapType } from '../types/gameLogic/maps/mapModel/gameMapType';
import { GameState } from '../types/gameBuilder/gameState';
import { Mob } from '../gameLogic/mobs/mob';
import { WorldPoint } from '../maps/mapModel/worldPoint';

export class BloodVisualsHandler {
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
    if (!target.pos || target.hp <= 0) return;

    const map = game.currentMap();

    if (!map) return;

    const damageRatio = dmg / target.maxhp;
    const chance = dmg / target.hp;

    const SIGNIFICANT_DAMAGE_THRESHOLD = 0.25;

    // Apply blood if either significant damage occurred or if a random chance is met.
    if (damageRatio >= SIGNIFICANT_DAMAGE_THRESHOLD || Math.random() < chance) {
      this.addBloodToCell(target.pos, map, damageRatio);
    }
  }

  /**
   * Adds blood to a specified cell on the map based on the damage ratio.
   *
   * This function marks the cell as bloody and increases its blood intensity,
   * clamping it to a maximum intensity. Depending on the given damage ratio,
   * it may also trigger a blood splash effect to neighboring cells.
   *
   * @param {WorldPoint} wp - The world point of the cell to add blood to.
   * @param {GameMapType} map - The map containing the cell.
   * @param {number} dmgRatio - The ratio of damage taken, determining blood intensity and splash.
   * @return {void} This function does not return a value.
   */

  private static addBloodToCell(
    wp: WorldPoint,
    map: GameMapType,
    dmgRatio: number,
  ): void {
    const cell = map.cell(wp);
    cell.bloody.isBloody = true;
    const MAX_BLOOD_INTENSITY = 2.0;

    const thresholds = [
      { threshold: 0.2, blood: 0.2, splashArea: 0, splashIntensity: 0 },
      { threshold: 0.5, blood: 0.5, splashArea: 1, splashIntensity: 0.5 },
      { threshold: 0.7, blood: 0.7, splashArea: 2, splashIntensity: 0.7 },
      { threshold: Infinity, blood: 1.0, splashArea: 3, splashIntensity: 1.0 },
    ];

    const entry = thresholds.find(t => dmgRatio <= t.threshold);
    if (entry) {
      const randomModifier = 1 + (Math.random() * 0.2 - 0.1);
      const finalBlood = entry.blood * randomModifier;

      // Accumulate blood intensity and clamp to the maximum.
      cell.bloody.intensity = Math.min(
        cell.bloody.intensity + finalBlood,
        MAX_BLOOD_INTENSITY,
      );

      if (entry.splashArea > 0) {
        this.addBloodSplash(wp, map, entry.splashArea, entry.splashIntensity);
      }
    }
  }

  /**
   * Spreads blood from a source cell to surrounding cells in a given area.
   *
   * The blood intensity is determined by the distance from the source cell,
   * and there is a chance to reduce the intensity on the outer edge.
   *
   * @param {WorldPoint} wp - The source cell of the blood splash.
   * @param {GameMapType} map - The map containing the cells.
   * @param {number} area - The radius of the blood splash area.
   * @param {number} baseIntensity - The base intensity of the blood splash.
   * @return {void} This function does not return a value.
   */
  private static addBloodSplash(
    wp: WorldPoint,
    map: GameMapType,
    area: number,
    baseIntensity: number,
  ): void {
    const bloodAreaRadius = area;
    const neighbors = wp.getNeighbors(bloodAreaRadius);
    const MAX_BLOOD_INTENSITY = 2.0;

    for (const neighbor of neighbors) {
      if (!EnvironmentChecker.isValidNeighbor(neighbor, map)) continue;
      if (!CanSee.checkPointLOS_RayCast(wp, neighbor, map)) continue;

      const neighborCell = map.cell(neighbor);
      const distanceFromCenter = wp.distanceTo(neighbor);
      const intensityModifier = 1 - distanceFromCenter / bloodAreaRadius;
      const randomModifier = 1 + (Math.random() * 0.2 - 0.1);
      let finalIntensity = baseIntensity * intensityModifier * randomModifier;

      // Reduce intensity on the outer edge.
      if (distanceFromCenter >= bloodAreaRadius - 1 && Math.random() < 0.5) {
        finalIntensity *= 0.5;
      }

      if (finalIntensity > 0) {
        neighborCell.bloody.isBloody = true;
        // Accumulate the intensity and clamp to MAX_BLOOD_INTENSITY.
        neighborCell.bloody.intensity = Math.min(
          neighborCell.bloody.intensity + finalIntensity,
          MAX_BLOOD_INTENSITY,
        );
      }
    }
  }
}
