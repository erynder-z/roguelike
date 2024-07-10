import { Glyph } from '../../Glyphs/Glyph';
import { Tile } from '../Types/Tile';

export const MAZE_LEVEL_TILES: Tile = {
  floor: [{ glyph: Glyph.Floor, occurrencePercentage: 100 }],
  wall: [{ glyph: Glyph.Obsidian, occurrencePercentage: 100 }],
};
