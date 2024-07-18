import { EnvEffect } from '../MapModel/Types/EnvEffect';
import { Glyph } from '../Glyphs/Glyph';
import { MapCell } from '../MapModel/MapCell';
import { Map } from '../MapModel/Types/Map';
import { WorldPoint } from '../MapModel/WorldPoint';

export class EnvironmentChecker {
  name: string = 'environment-checker';

  /**
   * Checks if items can be dropped on the given cell.
   *
   * @param {MapCell} cell - The cell to check.
   * @return {boolean} Returns true if items can be dropped, false otherwise.
   */
  public static canItemsBeDropped(cell: MapCell): boolean {
    return !cell.hasObject() && cell.env === Glyph.Floor;
  }

  /**
   * Checks if a neighbor is within bounds of the map.
   *
   * @param {WorldPoint} neighbor - The neighboring point to check.
   * @param {Map} map - The map containing the cells.
   * @return {boolean} Returns true if the neighbor is within bounds, false otherwise.
   */
  private static isValidNeighbor(neighbor: WorldPoint, map: Map): boolean {
    return !neighbor.isPositionOutOfBounds(neighbor, map);
  }

  /**
   * Add all environmental effects to the given cell.
   *
   * @param {MapCell} cell - The cell to add effects to.
   * @param {WorldPoint} w - The position of the cell.
   * @param {Map} map - The map containing the cells.
   * @return {void} This function does not return a value.
   */
  public static addCellEffects(cell: MapCell, w: WorldPoint, map: Map): void {
    this.addPoisonEffectToCell(cell, w, map);
    this.addConfusionEffectToCell(cell, w, map);
  }

  /**
   * Adds the poison effect to the cells surrounding the given cell, if it contains a Poison Mushroom glyph.
   *
   * @param {MapCell} cell - The cell to add the poison effect to.
   * @param {WorldPoint} w - The position of the cell.
   * @param {Map} map - The map containing the cells.
   * @return {void} This function does not return a value.
   */
  private static addPoisonEffectToCell(
    cell: MapCell,
    w: WorldPoint,
    map: Map,
  ): void {
    if (cell.glyph() === Glyph.PoisonMushroom) {
      const neighbors = w.getNeighbors(1);
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
   * @param {WorldPoint} w - The position of the cell.
   * @param {Map} map - The map containing the cells.
   * @return {void} This function does not return a value.
   */
  private static addConfusionEffectToCell(
    cell: MapCell,
    w: WorldPoint,
    map: Map,
  ): void {
    if (cell.glyph() === Glyph.ConfusionMushroom) {
      const neighbors = w.getNeighbors(1);
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
      case Glyph.PoisonMushroom:
        return EnvEffect.Poison;
      case Glyph.ConfusionMushroom:
        return EnvEffect.Confusion;
      default:
        return null;
    }
  }   

  /**
   * Clears the environmental effect in the area surrounding a specified cell.
   *
   * @param {WorldPoint} w - The position of the cell.
   * @param {Map} map - The map containing the cells.
   * @param {Glyph} glyph - The glyph representing the environmental effect.
   */
  public static clearCellEffectInArea(w: WorldPoint, map: Map, glyph: Glyph) {
    const effect = this.getEffectFromGlyph(glyph);

    if (effect != null) {
      const neighbors = w.getNeighbors(1);
      for (const neighbor of neighbors) {
        if (!this.isValidNeighbor(neighbor, map)) {
          continue;
        }
        const neighborCell = map.cell(neighbor);

        neighborCell.removeEnvEffect(effect);
      }
    }
  }
}
