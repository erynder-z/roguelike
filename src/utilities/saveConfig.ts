import { gameConfig } from '../gameConfig/gameConfig';
import { writeTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

/**
 * Saves the current build parameters to a file.
 *
 * The build parameters are saved in the app data directory as a JSON file
 * named 'initParamsConfig.json'. This file can be edited to change the
 * default startup parameters.
 *
 * @return {Promise<void>} A promise for when the file is saved.
 */
export const saveConfig = async (): Promise<void> => {
  const contents = JSON.stringify(gameConfig, null, 2); // Pretty print for readability

  await writeTextFile('gameConfig.json', contents, {
    baseDir: BaseDirectory.AppData,
  });
};
