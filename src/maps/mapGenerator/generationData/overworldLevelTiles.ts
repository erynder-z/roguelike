import { Glyph } from '../../../gameLogic/glyphs/glyph';
import { Tile } from '../types/tile';

export const OVERWORLD_LEVEL_TILES: Tile = {
  floor: [
    { glyph: Glyph.Regular_Floor, occurrencePercentage: 95 },
    { glyph: Glyph.Spiky_Crystal, occurrencePercentage: 1 },
    { glyph: Glyph.Glowing_Mushroom, occurrencePercentage: 1 },
    { glyph: Glyph.Poison_Mushroom, occurrencePercentage: 1 },
    { glyph: Glyph.Confusion_Mushroom, occurrencePercentage: 1 },
    { glyph: Glyph.Hidden_Trap, occurrencePercentage: 1 },
  ],
  wall: [
    { glyph: Glyph.Wall, occurrencePercentage: 84 },
    { glyph: Glyph.Rock, occurrencePercentage: 10.5 },
    { glyph: Glyph.Obsidian, occurrencePercentage: 5 },
    { glyph: Glyph.Magnetite, occurrencePercentage: 0.5 },
  ],
};
