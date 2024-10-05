// src/loaders/GlyphLoader.ts

import * as corpseData from '../components/Mobs/MobData/corpses.json';
import * as environmentData from '../components/Environment/EnvironmentData/environment.json';
import * as itemData from '../components/ItemObjects/ItemData/items.json';
import * as mobsData from '../components/Mobs/MobData/mobs.json';
import { GlyphMap } from '../components/Glyphs/GlyphMap';
import { GlyphInfo } from '../components/Glyphs/GlyphInfo';
import { initParams } from '../initParams/InitParams';
import {
  EnvironmentGlyph,
  MobGlyph,
  ItemGlyph,
  CorpseGlyph,
} from '../components/Glyphs/GlyphTypes';

/**
 * Responsible for loading and initializing glyphs into the GlyphMap.
 */
export class GlyphLoader {
  /**
   * Initializes all glyphs by loading data from various sources.
   * @returns {Promise<number>} The number of glyphs initialized.
   */
  public static async initializeGlyphs(): Promise<number> {
    return new Promise((resolve, reject) => {
      try {
        // Add player glyph
        const playerGlyph = new GlyphInfo(
          'Player', // id
          initParams.player.color, // fgCol
          '#4B5A52', // bgCol
          false, // hasSolidBg
          initParams.player.avatar, // char
          initParams.player.name, // name
          'The player character. You are here.', // description
          true, // isOpaque
          false, // isBlockingMovement
          false, // isBlockingProjectiles
          false, // isDiggable
          false, // isCausingSlow
          false, // isCausingBurn
          false, // isMagnetic
          false, // isCausingBleed
          false, // isGlowing
          false, // isCausingPoison
          false, // isCausingConfusion
        );
        GlyphMap.addGlyph(playerGlyph);

        // Load environment glyphs
        environmentData.environment.forEach((env: EnvironmentGlyph) => {
          const envGlyph = new GlyphInfo(
            env.id,
            env.fgCol,
            env.bgCol,
            env.hasSolidBg,
            env.char,
            env.name,
            env.description,
            env.isOpaque,
            env.isBlockingMovement,
            env.isBlockingProjectiles,
            env.isDiggable,
            env.isCausingSlow,
            env.isCausingBurn,
            env.isMagnetic,
            env.isCausingBleed,
            env.isGlowing,
            env.isCausingPoison,
            env.isCausingConfusion,
            env.help,
          );
          GlyphMap.addGlyph(envGlyph);
        });

        // Load mob glyphs
        mobsData.mobs.forEach((mob: MobGlyph) => {
          const mobGlyph = new GlyphInfo(
            mob.id,
            mob.fgCol,
            mob.bgCol,
            mob.hasSolidBg,
            mob.char,
            mob.name,
            mob.description,
            false, // Default values, adjust as needed
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            mob.help,
          );
          GlyphMap.addGlyph(mobGlyph);
        });

        // Load item glyphs
        itemData.items.forEach((item: ItemGlyph) => {
          const itemGlyph = new GlyphInfo(
            item.id,
            item.fgCol,
            item.bgCol,
            item.hasSolidBg,
            item.char,
            item.name,
            item.description,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            item.help,
          );
          GlyphMap.addGlyph(itemGlyph);
        });

        // Load corpse glyphs
        corpseData.corpses.forEach((corpse: CorpseGlyph) => {
          const corpseGlyph = new GlyphInfo(
            corpse.id,
            corpse.fgCol,
            corpse.bgCol,
            corpse.hasSolidBg,
            corpse.char,
            corpse.name,
            corpse.description,
            false, // Default values, adjust as needed
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            false,
            corpse.help,
          );
          GlyphMap.addGlyph(corpseGlyph);
        });

        resolve(GlyphMap.getRegistrySize());
      } catch (error) {
        reject(error);
      }
    });
  }
}
