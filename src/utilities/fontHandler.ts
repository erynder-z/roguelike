import { gameConfigManager } from '../gameConfigManager/gameConfigManager';
import { invoke } from '@tauri-apps/api/core';

type FontInfo = {
  name: string;
  path: string;
};

export class FontHandler {
  private static fonts: FontInfo[] = [];

  /**
   * Loads all fonts from the ./fonts directory and applies the first one found to the body element.
   *
   * This function is called when the game initializes, and it is responsible for loading all fonts
   * from the ./fonts directory. It then applies the first font it found to the body element by
   * setting its font-family CSS property.
   *
   * If no fonts are found, the function logs an error to the console.
   *
   * @returns A promise that resolves when the fonts are successfully loaded and applied or logs an error if it fails.
   */
  static async loadFonts(): Promise<void> {
    try {
      this.fonts = await invoke<FontInfo[]>('get_fonts_from_directory', {
        dir: '../fonts',
      });

      await Promise.all(this.fonts.map(font => this.loadFont(font)));

      this.applySelectedFont();
    } catch (err) {
      console.error('Failed to load fonts:', err);
    }
  }

  /**
   * Loads a single font from the given path and name.
   *
   * This function is called by loadFonts, and it is responsible for loading a single font
   * from the given path and name. It first checks if the font is already loaded by checking
   * if the font's name is in the list of all document fonts. If it is not loaded, it creates a
   * FontFace object with the given name and path, and then loads the font by calling the
   * load method. If the load is successful, the font is added to the document's font collection.
   * If the load fails, an error is logged to the console.
   * @param {FontInfo} font A FontInfo object containing the name and path of the font to load.
   * @returns A promise that resolves when the font is successfully loaded, or logs an error if it fails.
   */
  private static async loadFont(font: FontInfo): Promise<void> {
    const fontAlreadyLoaded = Array.from(document.fonts).some(
      fontFace => fontFace.family === font.name,
    );

    if (fontAlreadyLoaded) return;

    const fontFace = new FontFace(
      font.name,
      `url(${font.path}), format('truetype')`,
    );

    try {
      await fontFace.load();
      document.fonts.add(fontFace);
    } catch (err) {
      console.error(`Could not load font ${font.name} from ${font.path}:`, err);
    }
  }

  /**
   * Retrieves the names of all available fonts.
   *
   * Returns an array of font names that have been loaded. These font names
   * correspond to the fonts currently available for use in the application.
   *
   * @returns An array of strings representing the names of the available fonts.
   */

  static getAvailableFonts(): string[] {
    return this.fonts.map(f => f.name);
  }

  /**
   * Applies the selected font from the game configuration to the document's root element.
   *
   * Updates the CSS variable `--game-font` to reflect the current terminal font specified
   * in the game configuration. This ensures that any elements styled with this variable
   * will use the selected font.
   */

  static applySelectedFont(): void {
    const gameConfig = gameConfigManager.getConfig();
    const root = document.documentElement;
    root.style.setProperty('--game-font', `"${gameConfig.terminal.font}"`);
  }
}
