import { Glyph } from '../../../gameLogic/glyphs/glyph';
import { Tile } from '../../../types/gameLogic/maps/mapGenerator/tile';

export const MAZE_LEVEL_TILES: Tile = {
  floor: [
    { glyph: Glyph.Regular_Floor, occurrencePercentage: 100 },
    { glyph: Glyph.Arcane_Sigil, occurrencePercentage: 0.1 },
  ],
  wall: [{ glyph: Glyph.Obsidian, occurrencePercentage: 100 }],
};
