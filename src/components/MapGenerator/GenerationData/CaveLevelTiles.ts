import { Glyph } from '../../Glyphs/Glyph';
import { Tile } from '../Types/Tile';

export const CAVE_LEVEL_TILES: Tile = {
  floor: [
    { glyph: Glyph.Regular_Floor, occurrencePercentage: 96 },
    { glyph: Glyph.Spiky_Crystal, occurrencePercentage: 1 },
    { glyph: Glyph.Glowing_Mushroom, occurrencePercentage: 1 },
    { glyph: Glyph.Poison_Mushroom, occurrencePercentage: 1 },
    { glyph: Glyph.Confusion_Mushroom, occurrencePercentage: 1 },
  ],
  wall: [
    { glyph: Glyph.Wall, occurrencePercentage: 50 },
    { glyph: Glyph.Rock, occurrencePercentage: 50 },
  ],
};
