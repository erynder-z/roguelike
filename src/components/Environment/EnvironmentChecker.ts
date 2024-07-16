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
        if (neighbor.isPositionOutOfBounds(neighbor, map)) {
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
        if (neighbor.isPositionOutOfBounds(neighbor, map)) {
          continue;
        }
        const neighborCell = map.cell(neighbor);
        neighborCell.addEnvEffect(EnvEffect.Confusion);
      }
    }
  }
}
