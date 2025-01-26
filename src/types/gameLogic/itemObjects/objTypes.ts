import { Glyph } from '../../../gameLogic/glyphs/glyph';
import { ObjCategory } from '../../../gameLogic/itemObjects/itemCategories';
import { Slot } from '../../../gameLogic/itemObjects/slot';

export type ObjectTypes = {
  glyph: Glyph;
  slot: Slot;
  category: ObjCategory[];
};
