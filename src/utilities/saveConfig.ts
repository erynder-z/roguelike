import { open, BaseDirectory } from '@tauri-apps/plugin-fs';
import { gameConfig } from '../gameConfig/gameConfig';

/**
 * Saves the current game configuration to a file.
 *
 * The file is saved in the application data directory as `gameConfig.json`.
 * The file is written in UTF-8 format with pretty-printed JSON for readability.
 *
 * @returns {Promise<void>} A promise for when the configuration is saved.
 */
export const saveConfig = async (): Promise<void> => {
  try {
    const encoder = new TextEncoder();
    const contents = JSON.stringify(gameConfig, null, 2); // Pretty print for readability
    const data = encoder.encode(contents);

    const file = await open('gameConfig.json', {
      write: true,
      create: true,
      baseDir: BaseDirectory.AppData,
    });
    await file.write(data);
    await file.close();
  } catch (error) {
    console.error(error);
  }
};
