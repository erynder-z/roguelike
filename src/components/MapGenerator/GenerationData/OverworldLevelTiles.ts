import { Glyph } from '../../Glyphs/Glyph';
import { Tile } from '../Types/Tile';

export const OVERWORLD_LEVEL_TILES: Tile = {
  floor: [
    { glyph: Glyph.Floor, occurrencePercentage: 95 },
    { glyph: Glyph.SpikyCrystal, occurrencePercentage: 1 },
    { glyph: Glyph.GlowingMushroom, occurrencePercentage: 1 },
    { glyph: Glyph.PoisonMushroom, occurrencePercentage: 1 },
    { glyph: Glyph.ConfusionMushroom, occurrencePercentage: 1 },
    { glyph: Glyph.HiddenTrap, occurrencePercentage: 1 },
  ],
  wall: [
    { glyph: Glyph.Wall, occurrencePercentage: 84 },
    { glyph: Glyph.Rock, occurrencePercentage: 10.5 },
    { glyph: Glyph.Obsidian, occurrencePercentage: 5 },
    { glyph: Glyph.Magnetite, occurrencePercentage: 0.5 },
  ],
};
