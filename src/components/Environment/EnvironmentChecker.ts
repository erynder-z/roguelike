import { Glyph } from '../Glyphs/Glyph';
import { MapCell } from '../MapModel/MapCell';

export class EnvironmentChecker {
  name: string = 'environment-checker';
  static canItemsBeDropped(cell: MapCell): boolean {
    return !cell.hasObject() && cell.env === Glyph.Floor;
  }
}
