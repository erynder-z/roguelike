import { open, BaseDirectory, writeTextFile } from '@tauri-apps/plugin-fs';
import { gameConfig } from '../gameConfig/gameConfig';

/**
 * Saves the current game configuration to a JSON file named `gameConfig.json`.
 *
 * The configuration is saved in the application's data directory with pretty-printed JSON for readability.
 * If the file does not exist, it is created. The function handles any errors that occur during the file
 * operation by logging them to the console.
 *
 * @returns {Promise<void>}
 */
export const saveConfig = async (): Promise<void> => {
  try {
    const contents = JSON.stringify(gameConfig, null, 2); // Pretty print for readability

    const file = await open('gameConfig.json', {
      write: true,
      create: true,
      baseDir: BaseDirectory.AppData,
    });

    await writeTextFile('gameConfig.json', contents, {
      baseDir: BaseDirectory.AppData,
    });
    await file.close();
  } catch (error) {
    console.error(error);
  }
};
