import { Glyph } from '../../../gameLogic/glyphs/glyph';
import { Tile } from '../types/tile';

export const MAZE_LEVEL_TILES: Tile = {
  floor: [{ glyph: Glyph.Regular_Floor, occurrencePercentage: 100 }],
  wall: [{ glyph: Glyph.Obsidian, occurrencePercentage: 100 }],
};
