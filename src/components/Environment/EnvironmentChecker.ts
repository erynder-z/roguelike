import { EnvEffect } from '../MapModel/Types/EnvEffect';
import { Glyph } from '../Glyphs/Glyph';
import { MapCell } from '../MapModel/MapCell';
import { Map } from '../MapModel/Types/Map';
import { WorldPoint } from '../MapModel/WorldPoint';

export class EnvironmentChecker {
  name: string = 'environment-checker';
  public static canItemsBeDropped(cell: MapCell): boolean {
    return !cell.hasObject() && cell.env === Glyph.Floor;
  }

  /**
   * Adds the poison effect to the cells surrounding the given cell.
   *
   * @param {MapCell} cell - The cell to add the poison effect to.
   * @param {WorldPoint} w - The position of the cell.
   * @param {Map} map - The map containing the cells.
   * @return {void} This function does not return a value.
   */
  public static addPoisonEffectToCell(
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
}
