import { CanSee } from '../../utilities/canSee';
import { EnvEffect } from '../../types/gameLogic/maps/mapModel/envEffect';
import { GameMapType } from '../../types/gameLogic/maps/mapModel/gameMapType';
import { Glyph } from '../glyphs/glyph';
import { MapCell } from '../../maps/mapModel/mapCell';
import { WorldPoint } from '../../maps/mapModel/worldPoint';

export class EnvironmentChecker {
  private static areaOfEffectRadius: number = 1;

  /**
   * Checks if items can be dropped on the given cell.
   *
   * @param {MapCell} cell - The cell to check.
   * @return {boolean} Returns true if items can be dropped, false otherwise.
   */
  public static canItemsBeDropped(cell: MapCell): boolean {
    return !cell.hasObject() && cell.env === Glyph.Regular_Floor;
  }

  /**
   * Checks if a corpse can be dropped on the given cell.
   *
   * @param {MapCell} cell - The cell to check.
   * @return {boolean} Returns true if a corpse can be dropped, false otherwise.
   */
  public static canCorpseBeDropped(cell: MapCell): boolean {
    return !cell.corpse;
  }

  /**
   * Checks if a neighbor is within bounds of the map.
   *
   * @param {WorldPoint} neighbor - The neighboring point to check.
   * @param {GameMapType} map - The map containing the cells.
   * @return {boolean} Returns true if the neighbor is within bounds, false otherwise.
   */
  private static isValidNeighbor(
    neighbor: WorldPoint,
    map: GameMapType,
  ): boolean {
    return !neighbor.isPositionOutOfBounds(neighbor, map);
  }

  /**
   * Add all environmental effects to the given cell.
   *
   * @param {MapCell} cell - The cell to add effects to.
   * @param {WorldPoint} wp - The position of the cell.
   * @param {GameMapType} map - The map containing the cells.
   * @return {void} This function does not return a value.
   */
  public static addCellEffects(
    cell: MapCell,
    wp: WorldPoint,
    map: GameMapType,
  ): void {
    this.addPoisonEffectToCellNeighbors(cell, wp, map);
    this.addConfusionEffectToCellNeighbors(cell, wp, map);
  }

  /**
   * Adds the poison effect to the cells surrounding the given cell, if it contains a Poison Mushroom glyph.
   *
   * @param {MapCell} cell - The cell to add the poison effect to.
   * @param {WorldPoint} wp - The position of the cell.
   * @param {GameMapType} map - The map containing the cells.
   * @return {void} This function does not return a value.
   */
  private static addPoisonEffectToCellNeighbors(
    cell: MapCell,
    wp: WorldPoint,
    map: GameMapType,
  ): void {
    if (cell.glyph() === Glyph.Poison_Mushroom) {
      const neighbors = wp.getNeighbors(this.areaOfEffectRadius);

      for (const neighbor of neighbors) {
        if (!this.isValidNeighbor(neighbor, map)) {
          continue;
        }

        const neighborCell = map.cell(neighbor);

        neighborCell.addEnvEffect(EnvEffect.Poison);
      }
    }
  }

  /**
   * Adds the confusion effect to the neighboring cells of the given cell if it contains a Confusion Mushroom glyph.
   *
   * @param {MapCell} cell - The cell to add the confusion effect to.
   * @param {WorldPoint} wp - The position of the cell.
   * @param {GameMapType} map - The map containing the cells.
   * @return {void} This function does not return a value.
   */
  private static addConfusionEffectToCellNeighbors(
    cell: MapCell,
    wp: WorldPoint,
    map: GameMapType,
  ): void {
    if (cell.glyph() === Glyph.Confusion_Mushroom) {
      const neighbors = wp.getNeighbors(this.areaOfEffectRadius);

      for (const neighbor of neighbors) {
        if (!this.isValidNeighbor(neighbor, map)) {
          continue;
        }

        const neighborCell = map.cell(neighbor);

        neighborCell.addEnvEffect(EnvEffect.Confusion);
      }
    }
  }

  /**
   * Gets the environmental effect corresponding to the given glyph.
   *
   * @param {Glyph} glyph - The glyph to get the effect from.
   * @return {EnvEffect | null} The environmental effect corresponding to the glyph, or null if not found.
   */
  private static getEffectFromGlyph(glyph: Glyph): EnvEffect | null {
    switch (glyph) {
      case Glyph.Poison_Mushroom:
        return EnvEffect.Poison;
      case Glyph.Confusion_Mushroom:
        return EnvEffect.Confusion;
      default:
        return null;
    }
  }

  /**
   * Clears the environmental effect in the area surrounding a specified cell.
   *
   * @param {WorldPoint} wp - The position of the cell.
   * @param {GameMapType} map - The map containing the cells.
   * @param {Glyph} glyph - The glyph representing the environmental effect.
   */
  public static clearCellEffectInArea(
    wp: WorldPoint,
    map: GameMapType,
    glyph: Glyph,
  ) {
    const effect = this.getEffectFromGlyph(glyph);

    if (effect != null) {
      const neighbors = wp.getNeighbors(this.areaOfEffectRadius);

      for (const neighbor of neighbors) {
        if (!this.isValidNeighbor(neighbor, map)) {
          continue;
        }

        const neighborCell = map.cell(neighbor);

        neighborCell.removeEnvEffect(effect);
      }
    }
  }

  /**
   * Adds blood to a cell and potentially spreads it to neighbors based on damage ratio.
   *
   * This function marks the specified cell as bloody and increases its blood intensity
   * according to the provided damage ratio. If the damage ratio exceeds certain thresholds,
   * it may also spread blood to neighboring cells, creating a splash effect.
   *
   * @param {WorldPoint} wp - The world point of the cell to add blood to.
   * @param {GameMapType} map - The map containing the cells.
   * @param {number} dmgRatio - The ratio of damage dealt, determining blood intensity and sp‚lash.
   * @return {void} This function does not return a value.
   */

  /**
   * Adds blood to a cell and potentially spreads it to neighbors based on damage ratio.
   *
   * This function marks the specified cell as bloody and increases its blood intensity
   * according to the provided damage ratio. If the damage ratio exceeds certain thresholds,
   * it may also spread blood to neighboring cells, creating a splash effect.
   *
   * @param {WorldPoint} wp - The world point of the cell to add blood to.
   * @param {GameMapType} map - The map containing the cells.
   * @param {number} dmgRatio - The ratio of damage dealt, determining blood intensity and sp‚lash.
   * @return {void} This function does not return a value.
   */
  public static addBloodToCell(
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
   * Spreads blood in a splash area around the given world point, with
   * decreasing intensity as distance increases.
   *
   * @param {WorldPoint} wp - The center of the blood splash.
   * @param {GameMapType} map - The map containing the cells.
   * @param {number} area - The radius of the splash area.
   * @param {number} baseIntensity - The base intensity of the blood splash.
   */
  public static addBloodSplash(
    wp: WorldPoint,
    map: GameMapType,
    area: number,
    baseIntensity: number,
  ): void {
    const bloodAreaRadius = area;
    const neighbors = wp.getNeighbors(bloodAreaRadius);
    const MAX_BLOOD_INTENSITY = 2.0;

    for (const neighbor of neighbors) {
      if (!this.isValidNeighbor(neighbor, map)) continue;
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
