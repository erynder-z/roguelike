import { gameConfigManager } from '../gameConfigManager/gameConfigManager';

export class FontLoader {
  /**
   * Initializes the font used in the game by updating the global CSS variable `--game-font`.
   *
   * Retrieves the font setting from the game configuration and applies it to the document's
   * root element, ensuring consistency in font appearance across the game's user interface.
   *
   * @returns {Promise<void>} A promise that resolves once the font has been set.
   */

  public static initializeFont(): Promise<void> {
    const gameConfig = gameConfigManager.getConfig();
    return new Promise(resolve => {
      const root = document.documentElement;

      root.style.setProperty('--game-font', `"${gameConfig.terminal.font}"`);

      resolve();
    });
  }
}
