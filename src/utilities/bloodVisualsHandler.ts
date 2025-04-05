import { CanSee } from '../maps/helpers/canSee';
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
   * Adds blood to a cell when a mob takes damage.
   * Blood appears based on damage ratio or chance.
   */
  public static handleAttackBlood(
    target: Mob,
    dmg: number,
    game: GameState,
  ): void {
    if (this.bloodIntensity === 0 || !target.pos || target.hp <= 0) return;

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
   * Adds blood to a cell when a mob bleeds over time.
   */
  public static handleTickBlood(
    target: Mob,
    intensity: number,
    game: GameState,
  ): void {
    if (this.bloodIntensity === 0) return;

    const map = game.currentMap();
    if (map) this.addBloodToCell(target.pos, map, intensity);
  }

  /**
   * Applies blood effects to a specific cell based on damage intensity.
   * Blood can also splash onto nearby cells if damage is high.
   */
  private static addBloodToCell(
    wp: WorldPoint,
    map: GameMapType,
    damageRatio: number,
  ): void {
    const cell = map.cell(wp);
    cell.bloody.isBloody = true;

    const MAX_BLOOD_INTENSITY =
      this.bloodIntensity === 3 ? 2.0 : this.bloodIntensity === 2 ? 1.5 : 1.0;
    const bloodMultiplier =
      this.bloodIntensity === 3 ? 1.75 : this.bloodIntensity === 2 ? 1.25 : 1.0;

    const thresholds = [
      { threshold: 0.2, blood: 0.5, splashArea: 0, splashIntensity: 0 },
      { threshold: 0.5, blood: 1.0, splashArea: 1, splashIntensity: 1.0 },
      { threshold: 0.7, blood: 1.5, splashArea: 2, splashIntensity: 1.5 },
      { threshold: Infinity, blood: 2.0, splashArea: 3, splashIntensity: 2.0 },
    ];

    const entry = thresholds.find(t => damageRatio <= t.threshold);
    if (!entry) return;

    const randomModifier = 1 + (Math.random() * 0.3 - 0.15);
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

  /**
   * Spreads blood to neighboring cells, fading intensity based on distance.
   */
  private static addBloodSplash(
    wp: WorldPoint,
    map: GameMapType,
    area: number,
    baseIntensity: number,
  ): void {
    const neighbors = wp.getNeighbors(area);
    const MAX_BLOOD_INTENSITY =
      this.bloodIntensity === 3 ? 2.0 : this.bloodIntensity === 2 ? 1.5 : 1.0;
    const bloodMultiplier =
      this.bloodIntensity === 3 ? 1.75 : this.bloodIntensity === 2 ? 1.25 : 1.0;

    for (const neighbor of neighbors) {
      if (!EnvironmentChecker.isValidNeighbor(neighbor, map)) continue;
      if (!CanSee.checkPointLOS_RayCast(wp, neighbor, map)) continue;

      const neighborCell = map.cell(neighbor);
      const distance = wp.distanceTo(neighbor);
      const intensityModifier = 1 - distance / area;
      const randomModifier = 1 + (Math.random() * 0.3 - 0.15);
      let finalIntensity =
        baseIntensity * intensityModifier * randomModifier * bloodMultiplier;

      if (distance >= area - 2 && Math.random() < 0.5) {
        finalIntensity *= 0.5;
      }

      if (finalIntensity > 0) {
        // add blood to cell
        neighborCell.bloody.isBloody = true;
        neighborCell.bloody.intensity = Math.min(
          neighborCell.bloody.intensity + finalIntensity,
          MAX_BLOOD_INTENSITY,
        );

        if (neighborCell.mob) {
          // add blood to mob
          neighborCell.mob.bloody.isBloody = true;
          neighborCell.mob.bloody.intensity = Math.min(
            neighborCell.mob.bloody.intensity + finalIntensity,
            MAX_BLOOD_INTENSITY,
          );
        }
      }
    }
  }
}
